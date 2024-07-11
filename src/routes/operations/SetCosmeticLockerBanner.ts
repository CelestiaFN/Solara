import app from "../..";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner", verifyAuth, async (c) => {
        const profiles = await Profile.findOne({ accountId: c.req.param("accountId") }) as any;
        const query = await c.req.query()
        const body = await c.req.json()

        let profile = profiles.profiles[query.profileId];

        let profileChanges = [];

        if (!profile.items) profile.items = {};

        if (!profile.items[body.lockerItem]) return c.json(Solara.mcp.itemNotFound, 400)

        if (profile.items[body.lockerItem].templateId.toLowerCase() != "cosmeticlocker:cosmeticlocker_athena") return c.json(Solara.mcp.InvalidLockerSlotIndex, 400)

        let Bannericon = "";
        let Bannercolor = "";

        if (!profiles.profiles.common_core.items) profiles.profiles.common_core.items = {};

        for (let itemId in profiles.profiles.common_core.items) {
            let templateId = profiles.profiles.common_core.items[itemId].templateId;

            if (templateId.toLowerCase() == `HomebaseBannerIcon:${body.bannerIconTemplateName}`.toLowerCase()) { Bannericon = itemId; continue; }
            if (templateId.toLowerCase() == `HomebaseBannerColor:${body.bannerColorTemplateName}`.toLowerCase()) { Bannercolor = itemId; continue; }

            if (Bannericon && Bannercolor) break;
        }

        if (!Bannericon || !Bannercolor) return c.json(Solara.mcp.itemNotFound)

        profile.items[body.lockerItem].attributes.banner_icon_template = body.bannerIconTemplateName;
        profile.items[body.lockerItem].attributes.banner_color_template = body.bannerColorTemplateName;

        profile.stats.attributes.banner_icon = body.bannerIconTemplateName;
        profile.stats.attributes.banner_color = body.bannerColorTemplateName;

        profileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": body.lockerItem,
            "attributeName": "banner_icon_template",
            "attributeValue": profile.items[body.lockerItem].attributes.banner_icon_template
        });

        profileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": body.lockerItem,
            "attributeName": "banner_color_template",
            "attributeValue": profile.items[body.lockerItem].attributes.banner_color_template
        });

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${query.profileId}`]: profile } });

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: query.profileId,
            profileChangesBaseRevision: profile.rvn,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    });
}