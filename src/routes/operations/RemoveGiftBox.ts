import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import getVersion from "../../utils/functions/getVersion";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/RemoveGiftBox", verifyAuth, async (c) => {
        const profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
        const body = await c.req.json()
        const query = await c.req.query()        

        let profile = profiles?.profiles[(query.profileId as string)];
    
        const memory = getVersion(c);
    
        let ApplyProfileChanges: Object[] = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = query.rvn || -1;
    
        if (typeof body.giftBoxItemId == "string") {
            if (!profile.items[body.giftBoxItemId]) return c.json(Solara.mcp.itemNotFound, 400)
            if (!profile.items[body.giftBoxItemId].templateId.startsWith("GiftBox:")) return
    
            delete profile.items[body.giftBoxItemId];
    
            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": body.giftBoxItemId
            });
        }
    
        if (Array.isArray(body.giftBoxItemIds)) {
            for (let giftBoxItemId of body.giftBoxItemIds) {
                if (typeof giftBoxItemId != "string") continue;
                if (!profile.items[giftBoxItemId]) continue;
                if (!profile.items[giftBoxItemId].templateId.startsWith("GiftBox:")) continue;
    
                delete profile.items[giftBoxItemId];
    
                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": giftBoxItemId
                });
            }
        }
    
        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();
            await profiles?.updateOne({ $set: { [`profiles.${query.profileId}`]: profile } });
        }
    
        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }
    
        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    });
}