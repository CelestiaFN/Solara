import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { Solara } from "../../utils/errors/Solara";
import { v4 as uuidv4 } from "uuid";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin", verifyAuth, async (c) => {
        try {
            const { profileId, rvn } = c.req.query();
            const profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
            const profile = profiles?.profiles.athena;

            if (!profile) {
                return c.json(Solara.mcp.profileNotFound, 404);
            }

            const body = await c.req.json();
            if (body) {
                console.log(body);
            }

            const quests = JSON.parse(JSON.stringify(require("../../../static/data/quests.json")));
            const ver = getVersion(c);
            const DateFormat = (new Date().toISOString()).split("T")[0];
            let profileChanges = [];
            let ShouldGiveQuest = true;
            let questIds;

            if (profileId === "athena") {
                if (quests[`Season${ver.season < 10 ? `0${ver.season}` : ver.season}`]) {
                    questIds = quests[`Season${ver.season < 10 ? `0${ver.season}` : ver.season}`];
                }
            }

            const questManager = profile.stats.attributes.quest_manager;
            if (questManager?.dailyLoginInterval?.includes("T")) {
                const DailyLoginDate = questManager.dailyLoginInterval.split("T")[0];
                ShouldGiveQuest = DailyLoginDate !== DateFormat;

                if (ShouldGiveQuest && questManager.dailyQuestRerolls <= 0) {
                    questManager.dailyQuestRerolls += 1;
                }
            }

            for (const key in profile.items) {
                if (key.startsWith("QS") && Number.isInteger(Number(key[2])) && Number.isInteger(Number(key[3])) && key[4] === "-") {
                    if (!key.startsWith(`QS${ver.season < 10 ? `0${ver.season}` : ver.season}-`)) {
                        delete profile.items[key];
                        profileChanges.push({
                            changeType: "itemRemoved",
                            itemId: key,
                        });
                    }
                }
            }

            if (questIds) {
                let QuestsToAdd: any = [];

                if (profileId === "athena") {
                    for (const ChallengeSchedulesID in questIds.ChallengeScheduless) {
                        if (profile.items[ChallengeSchedulesID]) {
                            profileChanges.push({
                                changeType: "itemRemoved",
                                itemId: ChallengeSchedulesID,
                            });
                        }

                        const ChallengeSchedules = questIds.ChallengeScheduless[ChallengeSchedulesID];
                        profile.items[ChallengeSchedulesID] = {
                            templateId: ChallengeSchedules.templateId,
                            attributes: {
                                unlock_epoch: new Date().toISOString(),
                                max_level_bonus: 0,
                                level: 1,
                                item_seen: true,
                                xp: 0,
                                favorite: false,
                                granted_bundles: ChallengeSchedules.granted_bundles,
                            },
                            quantity: 1,
                        };

                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: ChallengeSchedulesID,
                            item: profile.items[ChallengeSchedulesID],
                        });
                    }

                    for (const ChallengeID in questIds.ChallengeBundles) {
                        if (profile.items[ChallengeID]) {
                            profileChanges.push({
                                changeType: "itemRemoved",
                                itemId: ChallengeID,
                            });
                        }

                        const ChallengeBundle = questIds.ChallengeBundles[ChallengeID];
                        profile.items[ChallengeID] = {
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

                        QuestsToAdd = QuestsToAdd.concat(ChallengeBundle.grantedquestinstanceids);
                        profile.items[ChallengeID].attributes.num_granted_bundle_quests = ChallengeBundle.grantedquestinstanceids.length;

                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: ChallengeID,
                            item: profile.items[ChallengeID],
                        });
                    }
                } else {
                    for (const key in questIds.Quests) {
                        QuestsToAdd.push(key);
                    }
                }

                for (const QuestID of QuestsToAdd) {
                    parseQuest(QuestID, profile, profileChanges, questIds);
                }
            }

            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            if (profileChanges.length < 0) {
                profileChanges = [{ changeType: "fullProfileUpdate", profile }];
            }

            await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });

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
        }
    });

    function parseQuest(QuestID: any, profile: any, profileChanges: any, SeasonQuestIDS: any) {
        const Quest = SeasonQuestIDS.Quests[QuestID];

        if (profile.items[QuestID]) {
            profileChanges.push({
                changeType: "itemRemoved",
                itemId: QuestID,
            });
        }

        profile.items[QuestID] = {
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
