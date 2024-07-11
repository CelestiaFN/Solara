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
      clientId: "1257854812767125504",
      clientSecret: "B9kOPJUH8bDa55pvhgm-H4MMuhq_yDga",
      code,
      scope: "identify+guilds+email+guilds.join",
      grantType: "authorization_code",
      redirectUri: "https://Hydro.itztiva.com/api/oauth/discord/callback/",
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
      `https://discord.com/api/v10/guilds/1225132031365615678/members/${id}`,
      {
        headers: { Authorization: `Bot MTI1Nzg1NDgxMjc2NzEyNTUwNA.GPaydr.B4Aidg6dC_bDw0Wq8cT40zpIFHUbbTbQlz-jys` },
      }
    );
    const { roles } = guilds.data;

    const roleIds = {
      '1225132031365615680': 0, // member
      '1225145872535388180': 1, // private
      '1225150047969345586': 2, // deluxe 
      '1249316658468880495': 3, // Hydro
      '1245853114288836719': 4, // support
      '1257360998751404072': 5, // lead support
      '1245853189035659445': 6, // moderator 
      '1245853269163638844': 7, // admin
      '1245873425982029885': 8, // developer
      '1231811683412869210': 9, // co owner
      '1225132031365615684': 10 // owner 
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
    if (user && Number(user.role) >= 6) {
      await axios.post(`http://127.0.0.1:21491/Hydro/gift/fl/${user.accountId}`);
    }

    if (!user) {
      try {
        await axios.post("https://Hydro.itztiva.com/register", {
          username: username,
          discordId: discordId,
        });
      } catch (error) {
      }
      let user = (await User.findOne({ discordId })) as any;
      const exchangecode = uuidv4().replace(/-/gi, "");

      updateTokens(user.accountId, "exchange_code", exchangecode, [
        "exchange:code DELETE",
      ]);
      return c.redirect("Hydro://" + exchangecode);
    } else {
      user.role = userrole
      user.save()
      const exchangecode = uuidv4().replace(/-/gi, "");

      updateTokens(user.accountId, "exchange_code", exchangecode, [
        "exchange:code DELETE",
      ]);
      return c.redirect("Hydro://" + exchangecode);
    }
  });
}
