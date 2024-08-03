import app from "../../";
import Profile from "../../database/models/profiles";
import User from "../../database/models/users";
import fs from "node:fs";
import path from "node:path";
import Stats from "../../database/models/stats";
import { Solara } from "../../utils/errors/Solara";
import { v4 } from "uuid";
import { z } from "zod"; // Ensure zod is imported
import { refreshAccount } from "../../utils/handlers/refreshAccount";

// moved outside for better performance
const xpJson = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "..", "static", "data", `xp.json`),
    "utf8"
);
const xpdata = JSON.parse(xpJson);

// also moved outside for better performance
const bp = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "..", "static", "bp", `s13.json`),
    "utf8"
);
const bpdata = JSON.parse(bp);

export default function () {
    app.post("/celestia/api/:username/dedicated_server/ApplyMatchResults", async (c) => {
        let body;
        try {
            body = await c.req.json();
        } catch (error) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        const bodySchema = z.object({
            Playlist: z.string(),
            Position: z.number(),
            XP: z.number().optional(),
            Eliminations: z.number(),
            ChallengeUpdates: z.any().optional(),
        });

        const safeBody = bodySchema.safeParse(body);
        if (!safeBody.success) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        const { Playlist, Position, XP, Eliminations, ChallengeUpdates } = safeBody.data;

        if (!Playlist || !Position) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        let xpBody = XP || 1;

        const username = c.req.param("username");

        const user = await User.findOne({ username });
        if (!user) {
            return c.json(Solara.account.accountNotFound, 404);
        }
        const profile = await Profile.findOne({ accountId: user.accountId });
        if (!profile) {
            return c.json(Solara.mcp.profileNotFound, 404);
        }
        const stats = await Stats.findOne({ accountId: user.accountId });
        if (!stats) {
            return c.json(Solara.account.accountNotFound, 404);
        }

        const newXp = (profile.profiles.athena.stats.attributes.xp += xpBody);

        const vKill = 150;
        const vWin = 400;

        if (Position == 1) {
            profile.profiles.common_core.items["Currency:MtxPurchased"].quantity += vWin;
            const reward = "AthenaGlider:Umbrella_Season_13";

            const giftBoxId = v4();

            const lootList = [
                { itemType: reward, itemGuid: reward, quantity: 1 },
                {
                    itemType: "AthenaGlider:Solo_Umbrella",
                    itemGuid: "AthenaGlider:Solo_Umbrella",
                    quantity: 1,
                },
            ];

            const giftBoxItemTemplate = {
                templateId: "GiftBox:GB_SeasonFirstWin",
                attributes: { max_level_bonus: 0, fromAccountId: "Server", lootList },
            };

            const seasonUmbrellaTemplate = {
                templateId: reward,
                attributes: {
                    max_level_bonus: 0,
                    level: 1,
                    item_seen: false,
                    xp: 0,
                    variants: [],
                    favorite: false,
                },
                quantity: 1,
            };

            const theUmbrellaTemplate = {
                templateId: "AthenaGlider:Solo_Umbrella",
                attributes: {
                    max_level_bonus: 0,
                    level: 1,
                    item_seen: false,
                    xp: 0,
                    variants: [],
                    favorite: false,
                },
                quantity: 1,
            };

            if (!profile.profiles.athena.items["AthenaGlider:Solo_Umbrella"]) {
                profile.profiles.common_core.items[giftBoxId] = giftBoxItemTemplate;
                profile.profiles.athena.items[reward] = seasonUmbrellaTemplate;
                profile.profiles.athena.items["AthenaGlider:Solo_Umbrella"] = theUmbrellaTemplate;
            }
        }

        profile.profiles.common_core.items["Currency:MtxPurchased"].quantity += vKill * Eliminations;

        if (!profile.profiles.athena.stats.attributes.book_purchased) {
            const lootList = [];
            const rewardList = bpdata.rewards[0];

            for (const [item, quantity] of Object.entries(rewardList)) {
                lootList.push({
                    itemType: item,
                    itemGuid: item,
                    quantity,
                });
                profile.profiles.athena.items[item] = {
                    templateId: item,
                    attributes: {
                        favorite: false,
                        item_seen: false,
                        level: 0,
                        max_level_bonus: 0,
                        rnd_sel_cnt: 0,
                        variants: [],
                        xp: 0,
                    },
                };
            }

            profile.profiles.common_core.items["GiftBox:gb_battlepasspurchased"] = {
                templateId: "GiftBox:gb_battlepasspurchased",
                attributes: {
                    max_level_bonus: 0,
                    fromAccountId: "",
                    lootList: lootList,
                },
            };

            profile.profiles.athena.stats.attributes.book_level = 1;
            profile.profiles.athena.stats.attributes.book_purchased = true;
        }

        let currentLevel = profile.profiles.athena.stats.attributes.level;
        let remainingXp = newXp;

        while (remainingXp > 0) {
            const currentLevelData = xpdata.find((level: any) => level.Level === currentLevel);

            if (!currentLevelData) {
                break;
            }

            const xpToNextLevel = currentLevelData.XpToNextLevel - profile.profiles.athena.stats.attributes.xp;

            if (remainingXp >= xpToNextLevel) {
                profile.profiles.athena.stats.attributes.level += 1;
                profile.profiles.athena.stats.attributes.accountLevel += profile.profiles.athena.stats.attributes.level;
                profile.profiles.athena.stats.attributes.book_level = profile.profiles.athena.stats.attributes.level;
                profile.profiles.athena.stats.attributes.book_xp = 0;
                profile.profiles.athena.stats.attributes.xp = 0;
                remainingXp -= xpToNextLevel;

                const lootList = [];
                const rewardList = bpdata.rewards[profile.profiles.athena.stats.attributes.level - 1];

                if (!rewardList) break;

                for (const [item, quantity] of Object.entries(rewardList)) {
                    lootList.push({
                        itemType: item,
                        itemGuid: item,
                        quantity,
                    });
                    if (item.toLowerCase().includes("athena")) {
                        profile.profiles.athena.items[item] = {
                            templateId: item,
                            attributes: {
                                favorite: false,
                                item_seen: false,
                                level: 0,
                                max_level_bonus: 0,
                                rnd_sel_cnt: 0,
                                variants: [],
                                xp: 0,
                            },
                        };
                    }
                    if (item.toLowerCase().includes("currency:mtx")) {
                        profile.profiles.common_core.items["Currency:MtxPurchased"].quantity += quantity;
                    }
                    if (item.toLowerCase().includes("homebasebannericon")) {
                        profile.profiles.common_core.items[item] = {
                            templateId: item,
                            attributes: {
                                item_seen: false,
                            },
                            quantity: 1,
                        };
                    }
                    profile.profiles.common_core.items["GiftBox:gb_battlepass"] = {
                        templateId: "GiftBox:gb_battlepass",
                        attributes: {
                            max_level_bonus: 0,
                            fromAccountId: "",
                            lootList: lootList,
                        },
                    };
                }
            } else {
                profile.profiles.athena.stats.attributes.xp += remainingXp;
                profile.profiles.athena.stats.attributes.book_xp += remainingXp;
                remainingXp = 0;
            }
            currentLevel += 1;
        }

        stats.MatchesPlayed += 1;

        if (ChallengeUpdates) {
            Object.entries(ChallengeUpdates).forEach(([key, value]) => {
                const quest = profile.profiles.athena.items[(value as any).BackendName];
                //     console.log(quest);
                //   console.log(value)
            });
        }

        switch (true) {
            case Playlist.includes("DefaultSolo"):
                stats.solos.kills += Eliminations;
                stats.solos.matchplayed += 1;

                if (Position == 1) {
                    stats.solos.wins += 1;
                }

                refreshAccount(user.accountId, user.username);
                break;

            case Playlist.includes("DefaultDuo"):
                stats.duos.kills += Eliminations;
                stats.duos.matchplayed += 1;

                if (Position == 1) {
                    stats.duos.wins += 1;
                }

                refreshAccount(user.accountId, user.username);
                break;

            case Playlist.includes("DefaultSquad"):
                stats.squads.kills += Eliminations;
                stats.squads.matchplayed += 1;

                if (Position == 1) {
                    stats.squads.wins += 1;
                }

                refreshAccount(user.accountId, user.username);
                break;

            default:
                // do nun
                break;
        }

        const profileUpdate = await profile.updateOne(profile);
        const statsUpdate = await stats.updateOne(stats);

        if (profileUpdate.modifiedCount === 0 || statsUpdate.modifiedCount === 0) {
            console.error("Failed to update profile or stats");
        }

        refreshAccount(user.accountId, user.username);
        return c.json({});
    });
}