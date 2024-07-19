import app from "../..";
import Profile from "../../database/models/profiles";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { updateTokens } from "../../utils/functions/updateTokens";
import { Solara } from "../../utils/errors/Solara";

export default function () {
  app.post("/api/launcher/account", async (c) => {
    try {
      const { exchange_code } = await c.req.json();
      if (!exchange_code) {
        return c.text("No exchange code in body!");
      }
      const foundAccount = await Tokens.findOne({
        token: exchange_code,
      });

      if (!foundAccount)
        return c.json({
          message: "Exchange code not found",
        });
      const user = await User.findOne({ accountId: foundAccount.accountId }) as any;

      if (!user) {
        return c.json({ message: "User not found" });
      }
      const profiles = await Profile.findOne({
        accountId: foundAccount.accountId,
      });

      if (!profiles) {
        return c.json({ message: "Profile not found" });
      }

      const athena = profiles.profiles.athena;

      const fav_character = athena.stats.attributes.favorite_character;

      const selectedSkin = athena.items[fav_character]?.templateId || "AthenaCharacter:CID_557_Athena_Commando_F_RebirthDefaultB";

      const xpAmount = athena.stats.attributes.xp;
      const lvl = athena.stats.attributes.level;
      const vBucks =
        profiles.profiles.common_core.items["Currency:MtxPurchased"].quantity;

      let userData = user;

      let t = jwt.sign(
        JSON.stringify({
          email: userData.email,
          accountId: foundAccount.accountId,
          type: "access",
        }),
        `${Bun.env.JWT_SECRET}`
      );

      updateTokens(user.accountId, "launcher_accesstoken", t, [
        "launcher:accesstoken DELETE",
      ]);

      const roleNames = {
        "0": "Member",
        "1": "Server Booster",
        "2": "Urban Donator",
        "3": "Glimmer Donator",
        "4": "Harvester Donator",
        "5": "Legacy Donator",
        "6": "Content Creator",
        "7": "Helper",
        "8": "Moderator",
        "9": "Admin",
        "10": "Manager",
        "11": "Developer",
        "12": "Co Owner",
        "13": "Owner",
      } as any;

      const roleColors = {
        "0": "#333",
        "1": "#f47fff",
        "2": "#ff00ca",
        "3": "#09004e",
        "4": "#14b47b",
        "5": "#cf480e",
        "6": "#410fc2",
        "7": "#bb1481",
        "8": "#27b5d1",
        "9": "#c31432",
        "10": "#3f00bb",
        "11": "#366e5d",
        "12": "#f38246",
        "13": "#0d97c5",
      } as any;

      const role = roleNames[userData.role];
      const roleColor = roleColors[userData.role];

      return c.json({
        success: true,
        user: userData,
        accessToken: t,
        season: {
          bookLevel: `${athena.stats.attributes.book_level}`,
          book_xp: athena.stats.attributes.book_xp,
          level: athena.stats.attributes.level,
          xp: athena.stats.attributes.xp,
          bookowned: athena.stats.attributes.book_purchased
        },
        pastseasons: athena.stats.attributes.past_seasons,
        athena: { 
          XP: xpAmount, 
        },
        level: lvl,
        character: {
          templateId: selectedSkin,
          rarity: "rare",
        },
        common_core: { 
          VBucks: vBucks 
        },
        rolename: role,
        rolecolor: roleColor,
      });
    } catch (err) {
      console.error(err);
      c.json({ message: "Internal server error" });
    }
  });
}
