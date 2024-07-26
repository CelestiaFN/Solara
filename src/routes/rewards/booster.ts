import app from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users"
import { Solara } from "../../utils/errors/Solara"
import { v4 } from "uuid"
import { createItemTemplate } from "../../utils/handlers/createItemTemplate"

export default function () {
    app.post("/celestia/grant/donator/booster/:accountId", async (c) => {
        const profile = await Profile.findOne({ accountId: c.req.param("accountId") })
        const user = await User.findOne({ accountId: c.req.param("accountId") });
        if (!profile || !user) return c.json(Solara.account.accountNotFound, 404)
        user.isBooster = true;
        await User.updateOne({ accountId: c.req.param("accountId") }, user);
        try {
            let athena = profile?.profiles.athena;

            const giftBoxId = v4();

            const lootList: any[] = [];

            const template = {
                templateId: "GiftBox:GB_FortnitemaresChallenges",
                attributes: {
                    max_level_bonus: 0,
                    params: {
                        userMessage:
                            "Thank you for boosting Celestia!",
                    },
                    fromAccountId: "Celestia",
                    lootList
                },
                quantity: 1,
            };

            const itemIds = [
                "AthenaCharacter:CID_439_Athena_Commando_F_SkullBriteEclipse",
                "AthenaCharacter:CID_240_Athena_Commando_F_Plague",
                "AthenaCharacter:CID_598_Athena_Commando_M_Mastermind",
                "AthenaPickaxe:Pickaxe_ID_140_StreetGoth",
                "AthenaGlider:Glider_ID_078_Vampire",
                "AthenaWrap:Wrap_080_Blackout1",
                "Currency:MtxGiveaway"
            ];

            itemIds.forEach((itemType) => {
                const template = {
                    templateId: itemType,
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
                athena.items[itemType] = template;
                
                lootList.push({
                    itemType: itemType,
                    itemGuid: itemType,
                    quantity: itemType === "Currency:MtxGiveaway" ? 1000 : 1,
                });
            });

            profile.profiles.common_core.items[giftBoxId] = template;

            if (!profile.profiles.common_core.items["Currency:MtxPurchased"]) {
                profile.profiles.common_core.items["Currency:MtxPurchased"] = {
                    templateId: "Currency:MtxPurchased",
                    attributes: {
                        platform: "EpicPC",
                    },
                    quantity: 0,
                };
            }
            profile.profiles.common_core.items[
                "Currency:MtxPurchased"
            ].quantity += 1000;

            await Profile.updateOne({ accountId: c.req.param("accountId") }, profile);

            return c.json({
                lootList,
                template: profile.profiles.common_core.items[giftBoxId]
            });
        } catch (error) {
            console.error("Error occurred:", error);
            return c.json(Solara.internal.serverError, 400);
        }
    })
}