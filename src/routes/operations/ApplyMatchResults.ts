import app from "../../";
import Profile from "../../database/models/profiles";
import User from "../../database/models/users";
import fs from "node:fs";
import path from "node:path";
import Stats from "../../database/models/stats";
import { Solara } from "../../utils/errors/Solara";
import { v4 } from "uuid";

export default function () {
    app.post("/celestia/api/:username/dedicated_server/ApplyMatchResults", async (c) => {
        const { Playlist, Position, XP, Eliminations, ChallengeUpdates } = await c.req.json();

        console.log(await c.req.json())
        
        if (!Playlist || !Position || !ChallengeUpdates) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        const xpJson = await fs.promises.readFile(
            path.join(__dirname, "..", "..", "..", "static", "data", `xp.json`),
            "utf8"
        );

        const xpdata = JSON.parse(xpJson);

        const bp = await fs.promises.readFile(
            path.join(__dirname, "..", "..", "..", "static", "bp", `s13.json`),
            "utf8"
        );

        const bpdata = JSON.parse(bp);

        let xpBody = XP

        if (!XP) {
            xpBody = 1
        }

        const user = await User.findOne({ username: c.req.param("username") });
        if (!user) {
            return c.json(Solara.account.accountNotFound, 404);
        }
        const profile = await Profile.findOne({ accountId: user.accountId });
        if (!profile) {
            return c.json(Solara.account.accountNotFound, 404);
        }
        const stats = await Stats.findOne({ accountId: user.accountId });
        if (!stats) {
            return c.json(Solara.account.accountNotFound, 404);
        }

        const newXp = (profile.profiles.athena.stats.attributes.xp += XP);

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

        if (Eliminations > 0) {
            profile.profiles.common_core.items["Currency:MtxPurchased"].quantity += vKill * Eliminations;
        }

        if (profile.profiles.athena.stats.attributes.book_purchased == false) {
            const lootList: any[] = [];
            const rewardList = bpdata.rewards[0];

            for (const [item, quantity] of Object.entries(rewardList)) {
                lootList.push({
                    itemType: item,
                    itemGuid: item,
                    quantity
                });
                profile.profiles.athena.items[item] = {
                    templateId: item,
                    attributes: {
                        favorite: false,
                        item_seen: true,
                        level: 0,
                        max_level_bonus: 0,
                        rnd_sel_cnt: 0,
                        variants: [],
                        xp: 0
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

            profile.profiles.athena.stats.attributes.book_level = 1
            profile.profiles.athena.stats.attributes.book_purchased = true;
        }

        for (const level of xpdata) {
            if (newXp >= level.XpToNextLevel) {
                profile.profiles.athena.stats.attributes.level += level.Level;
                profile.profiles.athena.stats.attributes.book_level = profile.profiles.athena.stats.attributes.level;
                profile.profiles.athena.stats.attributes.book_xp = 0;
                profile.profiles.athena.stats.attributes.xp -= level.XpToNextLevel;
                const lootList: any[] = [];
                const rewardList = bpdata.rewards[profile.profiles.athena.stats.attributes.level -= 1];

                for (const [item, quantity] of Object.entries(rewardList)) {
                    lootList.push({
                        itemType: item,
                        itemGuid: item,
                        quantity
                    });
                    if (item.toLowerCase().includes("athena")) {
                        profile.profiles.athena.items[item] = {
                            templateId: item,
                            attributes: {
                                favorite: false,
                                item_seen: true,
                                level: 0,
                                max_level_bonus: 0,
                                rnd_sel_cnt: 0,
                                variants: [],
                                xp: 0
                            },
                        };
                    }
                    if (item.toLowerCase().includes("currency:mtx")) {
                        profile.profiles.common_core.items["Currency:MtxPurchased"].quantity += quantity
                    }
                    if (item.toLowerCase().includes("homebasebannericon")) {
                        profile.profiles.common_core.items[item] = {
                            templateId: item,
                            attributes: {
                                item_seen: true
                            },
                            quantity: 1
                        }
                    }
                }
                profile.profiles.common_core.items["GiftBox:GB_BattlePass"] = {
                    templateId: "GiftBox:GB_BattlePass",
                    attributes: {
                        max_level_bonus: 0,
                        fromAccountId: "",
                        lootList: lootList,
                    },
                };
                if (profile.profiles.athena.stats.attributes.book_level >= 100)
                    profile.profiles.athena.stats.attributes.book_level = 100;
            } else {
                profile.profiles.athena.stats.attributes.book_xp += 0;
                profile.profiles.athena.stats.attributes.xp += xpBody;
                break;
            }
        }

        stats.MatchesPlayed += 1;

        if (Playlist.includes("DefaultSolo")) {
            stats.solos.kills += Eliminations;
            stats.solos.matchplayed += 1;

            if (Position == 1) {
                stats.solos.wins += 1;
            }

            await Profile.updateOne(
                { accountId: user.accountId },
                { $set: profile }
            );

            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });

            return c.json({});
        }

        if (Playlist.includes("DefaultDuo")) {
            stats.duos.kills += Eliminations;
            stats.duos.matchplayed += 1;

            if (Position == 1) {
                stats.duos.wins += 1;
            }

            await Profile.updateOne(
                { accountId: user.accountId },
                { $set: profile }
            );
            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });

            return c.json({});
        }

        if (Playlist.includes("DefaultSquad")) {
            stats.squads.kills += Eliminations;
            stats.squads.matchplayed += 1;

            if (Position == 1) {
                stats.squads.wins += 1;
            }
            await Profile.updateOne(
                { accountId: user.accountId },
                { $set: profile }
            );
            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });

            return c.json({});
        }

        await Profile.updateOne(
            { accountId: user.accountId },
            { $set: profile }
        );
        await Stats.updateOne({ accountId: user.accountId }, { $set: stats });

        return c.json({});
    });
}
