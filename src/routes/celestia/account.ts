import app from "../..";
import Profile from "../../database/models/profiles";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { updateTokens } from "../../utils/functions/updateTokens";
import { Solara } from "../../utils/errors/Solara";
import { config } from "../..";

export default function () {
  app.post("/api/launcher/account", async (c) => {
    try {
      const { exchange_code, hwid } = await c.req.json();
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

      if (config.MAINTENANCE === `true`) {
        if (Number(user.role) <= 0) {
          return c.html(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Maintenance</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #535252;
                    }
                    .container {
                        text-align: center;
                    }
                    .message {
                        font-size: 24px;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                        Servers are offline for maintenance. Please check back later!
                    </div>
                </div>
            </body>
            </html>
        `);
        }
      }

      user.hwid = hwid
      await user.save()

      const athena = profiles.profiles.athena;

      const fav_character = athena.stats.attributes.favorite_character;

      const selectedSkin = athena.items[fav_character]?.templateId.replace("_Celestia", "") || "AthenaCharacter:CID_557_Athena_Commando_F_RebirthDefaultB";

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
        "6": "Galaxy Donator",
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
        "6": "#bb26cf",
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
