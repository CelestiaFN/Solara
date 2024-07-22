import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { Solara } from "../../utils/errors/Solara";
import { v4 as uuidv4, v4 } from "uuid";
const quests = require("../../../static/data/quests.json");

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin", verifyAuth, async (c) => {
        try {
            const { profileId, rvn } = c.req.query();
            const profiles = await Profile.findOne({
                accountId: c.req.param("accountId"),
            });
            const profile = profiles?.profiles?.athena;

            if (!profiles) {
                return c.json(Solara.mcp.profileNotFound, 404);
            }

            const ver = getVersion(c);
            let profileChanges = [];
            let questIds: any;
            let ShouldGiveQuest = true;
            const DateFormat = (new Date().toISOString()).split("T")[0];
            if (profileId === "athena" && quests[`Season${ver.season < 10 ? `0${ver.season}` : ver.season}`]) {
                questIds = quests[`Season${ver.season < 10 ? `0${ver.season}` : ver.season}`];
            }

            const questManager = profile.stats.attributes.quest_manager;
            if (questManager?.dailyLoginInterval?.includes("T")) {
                const DailyLoginDate = questManager.dailyLoginInterval.split("T")[0];
                ShouldGiveQuest = DailyLoginDate !== DateFormat;

                if (ShouldGiveQuest && questManager.dailyQuestRerolls <= 0) {
                    questManager.dailyQuestRerolls += 1;
                }
            }

            for (var key in profile.items) {
                if (
                    key.startsWith("QS") &&
                    Number.isInteger(Number(key[2])) &&
                    Number.isInteger(Number(key[3])) &&
                    key[4] === "-"
                ) {
                    if (
                        !key.startsWith(
                            `QS${ver.season < 10 ? `0${ver.season}` : ver.season} -`
                        )
                    ) {
                        delete profile.items[key];

                        profileChanges.push({
                            changeType: "itemRemoved",
                            itemId: key,
                        });
                    }
                }
            }

            if (questIds) {
                var QuestsToAdd: any[] = [];

                if (profileId == "athena") {
                    for (var ChallengeBundleScheduleID in questIds.ChallengeBundleSchedules) {
                        if (profile.items.hasOwnProperty(ChallengeBundleScheduleID)) {
                            profileChanges.push({
                                changeType: "itemRemoved",
                                itemId: ChallengeBundleScheduleID,
                            });
                        }

                        var ChallengeBundleSchedule = questIds.ChallengeBundleSchedules[ChallengeBundleScheduleID];

                        if (!profile.items[ChallengeBundleSchedule]) {
                            profile.items[ChallengeBundleScheduleID] = {
                                templateId: ChallengeBundleSchedule.templateId,
                                attributes: {
                                    unlock_epoch: new Date().toISOString(),
                                    max_level_bonus: 0,
                                    level: 1,
                                    item_seen: true,
                                    xp: 0,
                                    favorite: false,
                                    granted_bundles: ChallengeBundleSchedule.granted_bundles,
                                },
                                quantity: 1,
                            };
                        }

                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: ChallengeBundleScheduleID,
                            item: profile.items[ChallengeBundleScheduleID],
                        });
                    }

                    for (var ChallengeBundleID in questIds.ChallengeBundles) {
                        if (profile.items.hasOwnProperty(ChallengeBundleID)) {
                            profileChanges.push({
                                changeType: "itemRemoved",
                                itemId: ChallengeBundleID,
                            });
                        }

                        var ChallengeBundle = questIds.ChallengeBundles[ChallengeBundleID];

                        if (!profile.items[ChallengeBundleID]) {
                            profile.items[ChallengeBundleID] = {
                                templateId: ChallengeBundle.templateId,
                                attributes: {
                                    has_unlock_by_completion: false,
                                    num_quests_completed: 0,
                                    level: 0,
                                    grantedquestinstanceids: ChallengeBundle.grantedquestinstanceids,
                                    item_seen: true,
                                    max_allowed_bundle_level: 0,
                                    num_granted_bundle_quests: 0,
                                    max_level_bonus: 0,
                                    challenge_bundle_schedule_id: ChallengeBundle.challenge_bundle_schedule_id,
                                    num_progress_quests_completed: 0,
                                    xp: 0,
                                    favorite: false,
                                },
                                quantity: 1,
                            };
                        }

                        QuestsToAdd = QuestsToAdd.concat(
                            ChallengeBundle.grantedquestinstanceids
                        );
                        profile.items[ChallengeBundleID].attributes.num_granted_bundle_quests = ChallengeBundle.grantedquestinstanceids.length;

                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: ChallengeBundleID,
                            item: profile.items[ChallengeBundleID],
                        });
                    }
                } else {
                    for (var key in questIds.Quests) {
                        QuestsToAdd.push(key);
                    }
                }

                function ParseQuest(QuestID: any) {
                    var Quest = questIds.Quests[QuestID];

                    if (profile.items.hasOwnProperty(QuestID)) {
                        profileChanges.push({
                            changeType: "itemRemoved",
                            itemId: QuestID,
                        });
                    }

                    if (profiles?.profiles?.athena) {
                        profiles.profiles.athena.items[QuestID] = {
                            templateId: Quest.templateId,
                            attributes: {
                                creation_time: new Date().toISOString(),
                                level: -1,
                                item_seen: true,
                                sent_new_notification: true,
                                challenge_bundle_id: Quest.challenge_bundle_id || "",
                                xp_reward_scalar: 1,
                                quest_state: "Active",
                                last_state_change_time: new Date().toISOString(),
                                max_level_bonus: 0,
                                xp: 0,
                                favorite: false,
                            },
                            quantity: 1,
                        };

                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: QuestID,
                            item: profile.items[QuestID],
                        });
                    }
                }

                for (var Quest in QuestsToAdd) {
                    ParseQuest(QuestsToAdd[Quest]);
                }
            }

            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            if (profileChanges.length > 0) {
                profileChanges = [{ changeType: "fullProfileUpdate", profile }];
            }

            await profiles.updateOne({
                $set: { [`profiles.${profileId} `]: profile },
            });

            return c.json({
                profileRevision: profile.rvn || 0,
                profileId: profileId,
                profileChangesBaseRevision: profile.rvn,
                profileChanges: profileChanges,
                profileCommandRevision: profile.commandRevision || 0,
                serverTime: new Date().toISOString(),
                responseVersion: 1,
            });
        } catch (error) {
            console.error(error);
            return c.json({ error: "Internal Server Error" }, 500);
        }
    });
}
