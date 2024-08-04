import app from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users"
import { Solara } from "../../utils/errors/Solara"
import { v4 } from "uuid"
import axios from "axios"
import { createItemTemplate } from "../../utils/handlers/createItemTemplate"
import { refreshAccount } from "../../utils/handlers/refreshAccount"

export default function () {
    app.post("/celestia/grant/donator/legacy/:accountId", async (c: any) => {
        const profile = await Profile.findOne({ accountId: c.req.param("accountId") })
        const user = await User.findOne({ accountId: c.req.param("accountId") });
        if (!profile || !user) return c.json(Solara.account.accountNotFound, 404)
        user.isLegacy = true;
        await User.updateOne({ accountId: c.req.param("accountId") }, user);
        try {
            let athena = profile?.profiles.athena;

            const giftBoxId = v4();

            const lootList: any[] = [];

            const template = {
                templateId: "GiftBox:GB_MakeGood",
                attributes: {
                    max_level_bonus: 0,
                    params: {
                        userMessage:
                            "Thank you for donating to Celestia!",
                    },
                    fromAccountId: "Celestia",
                    lootList
                },
                quantity: 1,
            };

            const itemIds = [
                "AthenaCharacter:CID_017_Athena_Commando_M",
                "AthenaCharacter:CID_028_Athena_Commando_F",
                "AthenaCharacter:CID_029_Athena_Commando_F_Halloween",
                "AthenaCharacter:CID_030_Athena_Commando_M_Halloween",
                "AthenaDance:EID_Fresh",
                "AthenaDance:EID_TakeTheL",
                "AthenaPickaxe:Pickaxe_ID_013_Teslacoil",
                "AthenaPickaxe:Pickaxe_Lockjaw",
                "AthenaGlider:FounderUmbrella",
            ];

            for (const itemType of itemIds) {
                let variants: any = [];
                const cleanedTemplateId = itemType.toLowerCase().replace(/(athenacharacter|athenabackpack|athenapickaxe|athenaglider|athenadance):/, '');
                if (itemType.includes("AthenaCharacter") || itemType.includes("AthenaBackpack")) {
                    const resp = await axios.get(`https://fortnite-api.com/v2/cosmetics/br/${cleanedTemplateId}`);
                    const data = resp.data.data;

                    if (!data) {
                        return null;
                    }

                    if (data.variants) {
                        data.variants.forEach((obj: any) => {
                            variants.push({
                                channel: obj.channel || "",
                                active: obj.options[0].tag || "",
                                owned: obj.options.map((variant: any) => variant.tag || "")
                            });
                        });
                    }
                }

                const template = {
                    templateId: itemType,
                    attributes: {
                        max_level_bonus: 0,
                        level: 1,
                        item_seen: false,
                        xp: 0,
                        variants: variants,
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
            }

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
            await refreshAccount(user.accountId, user.username)
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