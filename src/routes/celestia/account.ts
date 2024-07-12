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
        "1": "Private",
        "2": "Deluxe",
        "3": "Celestia",
        "4": "Support",
        "5": "Lead Support",
        "6": "Moderator",
        "7": "Admin",
        "8": "Developer",
        "9": "Co Owner",
        "10": "Owner",
      } as any;

      const roleColors = {
        "0": "#333",
        "1": "#83bfa4",
        "2": "#de1313",
        "3": "#c700ff",
        "4": "#dd1bca",
        "5": "#9d9d9d",
        "6": "#7bc2f3",
        "7": "#9655da",
        "8": "#20f00b",
        "9": "#df8f4f",
        "10": "#d1484a",
      } as any;

      const role = roleNames[userData.role];
      const roleColor = roleColors[userData.role];

      return c.json({
        success: true,
        user: userData,
        accessToken: t,
        athena: { XP: xpAmount, Level: lvl },
        character: {
          templateId: selectedSkin,
          rarity: "rare",
        },
        common_core: { VBucks: vBucks },
        rolename: role,
        rolecolor: roleColor,
      });
    } catch (err) {
      console.error(err);
      c.json({ message: "Internal server error" });
    }
  });
}
