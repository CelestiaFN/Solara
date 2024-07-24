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
      '1260793622648062063': 1, // server booster
      '1263582817242189914': 2, // urban donator
      '1263562145048690728': 3, // glimmer donator
      '1263577060555886614': 4, // harvester donator
      '1263573060234248253': 5, // legacy donator
      '1260967561911336970': 6, // content creator
      '1260791529996550204': 7, // support
      '1260791033009143859': 8, // moderator 
      '1260790404123721769': 9, // admin
      '1260816793660821514': 10, // manager
      '1260789391027212381': 11, // developer
      '1260791228233023591': 12, // co owner
      '1260788909781155902': 13 // owner 
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
    // mod+ fl

    if (user && Number(userrole) >= 8) {
      if (user.hasFL == false) {
        await axios.post(`http://127.0.0.1:21491/celestia/gift/fl/${user.accountId}`);
      }
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

      if (!user.isHarvester || !user.isLegacy || !user.isGlimmer || !user.isUrban) {
        user.isHarvester = false;
        user.isLegacy = false;
        user.isGlimmer = false;
        user.isUrban = false;
      }

      // booster
      if (roles.includes("1260793622648062063")) {
        if (user.isBooster == false) {
          user.isBooster = true
          await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/booster/${user.accountId}`);
        }
      }

      // donator stuff

      if (roles.includes("1263582817242189914")) {
        if (user.isUrban == false) {
          user.isUrban = true
          await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/urban/${user.accountId}`);
        }
      }

      if (roles.includes("1263562145048690728")) {
        if (user.isGlimmer == false) {
          user.isGlimmer = true
          await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/glimmer/${user.accountId}`);
        }
      }

      if (roles.includes("1263577060555886614")) {
        if (user.isHarvester == false) {
          user.isHarvester = true
          await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/harvester/${user.accountId}`);
        }
      }

      if (roles.includes("1263573060234248253")) {
        if (user.isLegacy == false) {
          user.isLegacy = true
          await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/legacy/${user.accountId}`);
        }
      }

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
