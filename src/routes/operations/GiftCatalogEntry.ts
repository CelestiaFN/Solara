import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import getVersion from "../../utils/functions/getVersion";
import Friends from "../../database/models/friends";
import fs from 'node:fs'
import axios from "axios";
import { v4 } from "uuid";
import User from "../../database/models/users";
import { refreshAccount } from "../../utils/handlers/refreshAccount";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/GiftCatalogEntry", verifyAuth, async (c) => {
        const query = await c.req.query()
        const params = await c.req.param()
        const body = await c.req.json()

        const profiles = await Profile.findOne({ accountId: params?.accountId });
        let profile = profiles?.profiles[query.profileId];
        let athena = profiles?.profiles["athena"];
        if (query.profileId != "common_core") return c.json(Solara.mcp.profileNotFound, 404)
        const ver = getVersion(c);
        let notifications: any[] = [];
        let profileChanges = [];
        let BaseRevision = profile.rvn || 0;
        let ProfileRevisionCheck =
            ver.build >= 12.2 ? profile.commandRevision : profile.rvn;
        let QueryRevision = query.rvn || -1;
        let validGiftBoxes = [
            "GiftBox:gb_default",
            "GiftBox:gb_giftwrap1",
            "GiftBox:gb_giftwrap2",
            "GiftBox:gb_giftwrap3",
        ];
        if (!validGiftBoxes.includes(body.giftWrapTemplateId)) return c.json(Solara.mcp.wrongItemType, 404)
        if (body.receiverAccountIds.length < 1 || body.receiverAccountIds.length > 5) return c.json(Solara.friends.invalidData, 404)
        let sender = await Friends.findOne({ accountId: params?.accountId }).lean();
        for (let receiverId of body.receiverAccountIds) {
            if (!sender?.list.accepted.find((i: any) => i.accountId == receiverId) && receiverId != params?.accountId) return c.json(Solara.friends.friendshipNotFound, 404)
        }
        if (!profile.items) profile.items = {};
        if (!athena.items) athena.items = {};
        const catalog = JSON.parse(fs.readFileSync("static/data/storefront.json", "utf8"));

        function findOffer(offerId: any) {
            for (let storefront of catalog.storefronts) {
                let findOfferId = storefront.catalogEntries.find(
                    (i: any) => i.offerId == offerId
                );
                if (findOfferId)
                    return { name: storefront.name, offerId: findOfferId };
            }
        }

        let findOfferId = findOffer(body.offerId) as any;
        if (!findOfferId) return c.json(Solara.storefront.invalidItem, 400);

        switch (true) {
            case /^BR(Daily|Weekly|Season)Storefront$|^BRSpecialFeatured$/.test(findOfferId.name):
                if (findOfferId.offerId.prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                    let paid = false;
                    let price = findOfferId.offerId.prices[0].finalPrice * body.receiverAccountIds.length;
                    for (let key in profile.items) {
                        if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;
                        let currencyPlatform = profile.items[key].attributes.platform;
                        if (currencyPlatform.toLowerCase() != profile.stats.attributes.current_mtx_platform.toLowerCase() && currencyPlatform.toLowerCase() != "shared") continue;
                        if (profile.items[key].quantity < price) return c.json(Solara.storefront.currencyInsufficient, 404)
                        profile.items[key].quantity -= price;
                        profileChanges.push({
                            changeType: "itemQuantityChanged",
                            itemId: key,
                            quantity: profile.items[key].quantity,
                        });

                        paid = true;
                        break;
                    }
                    if (!paid && price > 0) return c.json(Solara.storefront.currencyInsufficient, 404)
                }
                for (let receiverId of body.receiverAccountIds) {
                    const receiverProfiles = await Profile.findOne({
                        accountId: receiverId,
                    });
                    let athena = receiverProfiles?.profiles["athena"];
                    let common_core = receiverProfiles?.profiles["common_core"];
                    if (!athena.items) athena.items = {};
                    if (!common_core.stats.attributes.allowed_to_receive_gifts) return c.json(Solara.storefront.alreadyOwned, 404)
                    for (let itemGrant of findOfferId.offerId.itemGrants) {
                        for (let itemId in athena.items) {
                            if (itemGrant.templateId.toLowerCase() == athena.items[itemId].templateId.toLowerCase()) return c.json(Solara.storefront.alreadyOwned, 404)
                        }
                    }
                }
                for (let receiverId of body.receiverAccountIds) {
                    const receiverProfiles = await Profile.findOne({
                        accountId: receiverId,
                    });
                    let athena = receiverProfiles?.profiles["athena"];
                    let common_core = receiverId == params?.accountId ? profile : receiverProfiles?.profiles["common_core"];
                    let giftBoxItemID = v4();
                    let giftBoxItem = {
                        templateId: body.giftWrapTemplateId,
                        attributes: {
                            fromAccountId: params?.accountId,
                            lootList: [],
                            params: {
                                userMessage: body.personalMessage,
                            },
                            level: 1,
                            giftedOn: new Date().toISOString(),
                        },
                        quantity: 1,
                    } as any;
                    if (!athena.items) athena.items = {};
                    if (!common_core.items) common_core.items = {};
                    for (let value of findOfferId.offerId.itemGrants) {
                        let variants: any = [];
                        const cleanedTemplateId = value.templateId.toLowerCase().replace(/(athenacharacter|athenabackpack|athenapickaxe|athenaglider|athenadance):/, '');

                        if (value.templateId.includes("_Celestia") && value.templateId.includes("AthenaCharacter")) {
                          const styles = JSON.parse(fs.readFileSync("static/cosmetics/variants.json", "utf8"));
                          const variant = styles[value.templateId].variants;
                          variants = variant
                        }
              
                        if (!value.templateId.includes("_Celestia") && (value.templateId.includes("AthenaCharacter") || value.templateId.includes("AthenaBackpack"))) {
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
                        
                        const ID = v4();
                        const Item = {
                            templateId: value.templateId,
                            attributes: {
                                item_seen: false,
                                variants: variants,
                            },
                            quantity: 1,
                        };
                        athena.items[ID] = Item;
                        giftBoxItem.attributes.lootList.push({
                            itemType: Item.templateId,
                            itemGuid: ID,
                            itemProfile: "athena",
                            quantity: 1,
                        });
                    }
                    common_core.items[giftBoxItemID] = giftBoxItem;
                    if (receiverId == params?.accountId)
                        profileChanges.push({
                            changeType: "itemAdded",
                            itemId: giftBoxItemID,
                            item: common_core.items[giftBoxItemID],
                        });
                    athena.rvn += 1;
                    athena.commandRevision += 1;
                    athena.updated = new Date().toISOString();
                    common_core.rvn += 1;
                    common_core.commandRevision += 1;
                    common_core.updated = new Date().toISOString();
                    const receiverUser = await User.findOne({
                        accountId: receiverId,
                    });
                    if (!receiverUser) return c.json(Solara.account.accountNotFound, 404)
                    await receiverProfiles?.updateOne({
                        $set: {
                            [`profiles.athena`]: athena,
                            [`profiles.common_core`]: common_core,
                        },
                    });
                    refreshAccount(receiverId, receiverUser.username)
                }
                break;
        }
        if (profileChanges.length > 0 && !body.receiverAccountIds.includes(params?.accountId)) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();
            await profiles?.updateOne({
                $set: { [`profiles.${query.profileId}`]: profile },
            });
        }
        if (QueryRevision != ProfileRevisionCheck) {
            profileChanges = [
                {
                    changeType: "fullProfileUpdate",
                    profile: profile,
                },
            ];
        }
        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: profileChanges,
            notifications: notifications,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1,
        });
    });
}