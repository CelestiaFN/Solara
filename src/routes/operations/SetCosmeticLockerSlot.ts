import app from "../..";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import getVersion from "../../utils/functions/getVersion";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlot", async (c) => {
        const profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
        const body = await c.req.json()
    
        let profile = profiles?.profiles[(c.req.query("profileId") as string)];
    
        const ver = getVersion(c);
    
        if (c.req.query("profileId") == "athena") profile.stats.attributes.season_num = ver.season;
    
        let profileChanges: Object[] = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (ver.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = c.req.query("rvn") || -1;
        let specialCosmetics = [
            "AthenaCharacter:cid_random",
            "AthenaBackpack:bid_random",
            "AthenaPickaxe:pickaxe_random",
            "AthenaGlider:glider_random",
            "AthenaSkyDiveContrail:trails_random",
            "AthenaItemWrap:wrap_random",
            "AthenaMusicPack:musicpack_random",
            "AthenaLoadingScreen:lsid_random"
        ];
        
        if (!profile.items) profile.items = {};
    
        let itemToSlotID = "";
    
        if (body.itemToSlot) {
            for (let itemId in profile.items) {
                if (profile.items[itemId].templateId.toLowerCase() == body.itemToSlot.toLowerCase()) { itemToSlotID = itemId; break; };
            }
        }
    
        if (!profile.items[body.lockerItem]) return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)
    
        if (profile.items[body.lockerItem].templateId.toLowerCase() != "cosmeticlocker:cosmeticlocker_athena") return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)
    
        if (!profile.items[itemToSlotID] && body.itemToSlot) {
            let item = body.itemToSlot;
    
            if (!specialCosmetics.includes(item)) {
                return c.json(Solara.mcp.itemNotFound, 400)
            } else {
                if (!item.startsWith(`Athena${body.category}:`)) return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)
            }
        }
    
        if (profile.items[itemToSlotID]) {
            if (!profile.items[itemToSlotID].templateId.startsWith(`Athena${body.category}:`)) return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)
    
            let Variants = body.variantUpdates;
    
            if (Array.isArray(Variants)) {
                for (let i in Variants) {
                    if (typeof Variants[i] != "object") continue;
                    if (!Variants[i].channel) continue;
                    if (!Variants[i].active) continue;
    
                    let index = profile.items[itemToSlotID].attributes.variants.findIndex((x: any) => x.channel == Variants[i].channel);
    
                    if (index == -1) continue;
                    if (!profile.items[itemToSlotID].attributes.variants[index].owned.includes(Variants[i].active)) continue;
    
                    profile.items[itemToSlotID].attributes.variants[index].active = Variants[i].active;
                }
    
                profileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": itemToSlotID,
                    "attributeName": "variants",
                    "attributeValue": profile.items[itemToSlotID].attributes.variants
                });
            }
        }
    
        switch (body.category) {
            case "Dance":
                if (!profile.items[body.lockerItem].attributes.locker_slots_data.slots[body.category]) break;
    
                if (body.slotIndex >= 0 && body.slotIndex <= 5) {
                    profile.items[body.lockerItem].attributes.locker_slots_data.slots.Dance.items[body.slotIndex] = body.itemToSlot;
                    profile.stats.attributes.favorite_dance[body.slotIndex] = itemToSlotID || body.itemToSlot;
    
                    profileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": body.lockerItem,
                        "attributeName": "locker_slots_data",
                        "attributeValue": profile.items[body.lockerItem].attributes.locker_slots_data
                    });
                }
                break;
    
            case "ItemWrap":
                if (!profile.items[body.lockerItem].attributes.locker_slots_data.slots[body.category]) break;
    
                switch (true) {
                    case body.slotIndex >= 0 && body.slotIndex <= 7:
                        profile.items[body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[body.slotIndex] = body.itemToSlot;
                        profile.stats.attributes.favorite_itemwraps[body.slotIndex] = itemToSlotID || body.itemToSlot;
    
                        profileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": body.lockerItem,
                            "attributeName": "locker_slots_data",
                            "attributeValue": profile.items[body.lockerItem].attributes.locker_slots_data
                        });
                        break;
    
                    case body.slotIndex == -1:
                        for (let i = 0; i < 7; i++) {
                            profile.items[body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[i] = body.itemToSlot;
                            profile.stats.attributes.favorite_itemwraps[i] = itemToSlotID || body.itemToSlot;
                        }
    
                        profileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": body.lockerItem,
                            "attributeName": "locker_slots_data",
                            "attributeValue": profile.items[body.lockerItem].attributes.locker_slots_data
                        });
                        break;
                }
                break;
    
            default:
                if (!profile.items[body.lockerItem].attributes.locker_slots_data.slots[body.category]) break;
    
                if (body.category == "Pickaxe" || body.category == "Glider") {
                    if (!body.itemToSlot) return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)
                }
    
                profile.items[body.lockerItem].attributes.locker_slots_data.slots[body.category].items = [body.itemToSlot];
                profile.stats.attributes[(`favorite_${body.category}`).toLowerCase()] = itemToSlotID || body.itemToSlot;
    
                profileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": body.lockerItem,
                    "attributeName": "locker_slots_data",
                    "attributeValue": profile.items[body.lockerItem].attributes.locker_slots_data
                });
                break;
        }
    
        if (profileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();
            await profiles?.updateOne({ $set: { [`profiles.${c.req.query("profileId")}`]: profile } });
        }
    
        if (QueryRevision != ProfileRevisionCheck) {
            profileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }    

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: c.req.query("profileId"),
            profileChangesBaseRevision: BaseRevision,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    });
}