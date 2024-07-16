import app from "../..";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DiscordOAuth2 from "discord-oauth2";
import jwt from "jsonwebtoken";
import { updateTokens } from "../../utils/functions/updateTokens";

const oauth = new DiscordOAuth2();

export default function () {
  app.get("/api/oauth/discord/callback", async (c) => {
    const code = c.req.query("code");
    const tokenResponse = await oauth.tokenRequest({
      clientId: "1260815476695502848",
      clientSecret: "3J48NXc4_h45KH1T9zzAMcg3WPgT5_fL",
      code,
      scope: "identify+guilds",
      grantType: "authorization_code",
      redirectUri: "https://kys.itztiva.com/api/oauth/discord/callback/",
    });
    const { access_token } = tokenResponse;
    const userResponse = await axios.get(
      "https://discord.com/api/v10/users/@me",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { id, avatar, username } = userResponse.data;
    const discordId = id;
    const guilds = await axios.get(
      `https://discord.com/api/v10/guilds/1260785136551596083/members/${discordId}`,
      {
        headers: { Authorization: `Bot MTI2MDgxNTQ3NjY5NTUwMjg0OA.GkCS_f.xCwSbQTHD_S2ZisS2wTW_8QF-G-KpqBWM5gbRQ` },
      }
    );
    const { roles } = guilds.data;

    const roleIds = {
      '1260791766601433269': 0, // member
      '1260791529996550204': 2, // support
      '1260791033009143859': 3, // moderator 
      '1260790404123721769': 4, // admin
      '1260816793660821514': 5, // manager
      '1260789391027212381': 6, // developer
      '1260791228233023591': 7, // co owner
      '1260788909781155902': 8 // owner 
    } as any;

    let userrole = -1;

    for (const roleId of roles) {
      if (roleIds.hasOwnProperty(roleId)) {
        const role = roleIds[roleId];
        if (role > userrole) {
          userrole = role;
        }
      }
    }

    let user = (await User.findOne({ discordId })) as any;
    if (user && Number(user.role) >= 3) {
      await axios.post(`http://127.0.0.1:21491/celestia/gift/fl/${user.accountId}`);
    }

    if (!user) {
      try {
        await axios.post("http://127.0.0.1:21491/register", {
          username: username,
          discordId: discordId,
        });
      } catch (error) {

      }
      let user = (await User.findOne({ discordId })) as any;
      const exchangecode = uuidv4().replace(/-/gi, "");

      user.role = userrole
      user.save()

      updateTokens(user.accountId, "exchange_code", exchangecode, [
        "exchange:code DELETE",
      ]);
      return c.redirect("celestia://" + exchangecode);
    } else {
      user.role = userrole
      user.save()
      const exchangecode = uuidv4().replace(/-/gi, "");

      updateTokens(user.accountId, "exchange_code", exchangecode, [
        "exchange:code DELETE",
      ]);
      return c.redirect("celestia://" + exchangecode);
    }
  });
}
