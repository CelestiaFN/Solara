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

      const selectedSkin =
        athena.stats.attributes.favorite_character || "AthenaCharacter:CID_557_Athena_Commando_F_RebirthDefaultB";

      const xpAmount = athena.stats.attributes.xp;
      const lvl = athena.stats.attributes.level;
      const vBucks =
        profiles.profiles.common_core.items["Currency:MtxPurchased"].quantity;

      let userData = user

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
        "2": "Helper",
        "3": "Moderator",
        "4": "Admin",
        "5": "Manager",
        "6": "Developer",
        "7": "Co Owner",
        "8": "Owner",
      } as any;

      const roleColors = {
        "0": "#333",
        "1": "#f47fff",
        "2": "#bb1481",
        "3": "#27b5d1",
        "4": "#c31432",
        "5": "#3f00bb",
        "6": "#366e5d",
        "7": "#f38246",
        "8": "#0d97c5",
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
        level: athena.stats.attributes.level,
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
