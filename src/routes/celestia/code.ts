import app from "../..";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { updateTokens } from "../../utils/functions/updateTokens";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import axios from "axios"
import { Solara } from "../../utils/errors/Solara";

export default function () {
  app.post("/api/launcher/code", async (c) => {
    let token = c.req.header("authorization");
    const body: any = await c.req.json();
    if (!token) {
      return c.text("No token set in auth header!");
    }
    token = token.split(" ")[1];
    if (!token) {
      return c.json({ success: false, code: null });
    }
    let user: any;
    try {
      user = jwt.verify(token, `${Bun.env.JWT_SECRET}`);
    } catch (error) {
      console.error("Error jwt:", error);
      return c.text("Invalid token!");
    }
    if (!user || !user.accountId) {
      return c.text("Invalid token!");
    }
    const existingCode = await Tokens.findOne({ accountId: user.accountId, type: "launcher_code" });
    if (existingCode) {
      return c.json({ success: true, code: existingCode.token });
    }

    const existingUser = await User.findOne({ accountId: user.accountId })

    if (!existingUser) return c.json(Solara.account.accountNotFound, 404)

    const guilds = await axios.get(
      `https://discord.com/api/v10/guilds/1260785136551596083/members/${user.discordId}`,
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

    if (!existingUser.isHarvester || !existingUser.isLegacy || !existingUser.isGlimmer || !existingUser.isUrban) {
      existingUser.isHarvester = false;
      existingUser.isLegacy = false;
      existingUser.isGlimmer = false;
      existingUser.isUrban = false;
    }

    if (Number(userrole) >= 8) {
      if (existingUser.hasFL == false) {
        await axios.post(`http://127.0.0.1:21491/celestia/gift/fl/${user.accountId}`);
      }
    }

    if (roles.includes("1263582817242189914")) {
      if (existingUser.isUrban == false) {
        existingUser.isUrban = true
        await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/urban/${user.accountId}`);
      }
    }

    if (roles.includes("1263562145048690728")) {
      if (existingUser.isGlimmer == false) {
        existingUser.isGlimmer = true
        await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/glimmer/${user.accountId}`);
      }
    }

    if (roles.includes("1263577060555886614")) {
      if (existingUser.isHarvester == false) {
        existingUser.isHarvester = true
        await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/harvester/${user.accountId}`);
      }
    }

    if (roles.includes("1263573060234248253")) {
      if (existingUser.isLegacy == false) {
        existingUser.isLegacy = true
        await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/legacy/${user.accountId}`);
      }
    }

    await existingUser.updateOne({existingUser})

    const code = uuidv4().replace(/-/gi, "");

    if (body.type === "launcher_code") {
      updateTokens(user.accountId, "launcher_code", code, [
        "launcher:code DELETE",
      ]);
      return c.json({ success: true, code: code });
    } else {
      updateTokens(user.accountId, "exchange_code", code, [
        "exchange:code DELETE",
      ]);
      return c.json({ success: true, code: code });
    }
  });
}
