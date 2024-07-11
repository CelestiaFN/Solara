import app from "../..";
import { v4 } from "uuid";
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry", verifyAuth, async (c) => {
        const profiles = await Profile.findOne({ accountId: c.req.param("accountId") }) as any;

        let profile = profiles?.profiles[c.req.query("profileId") as string];
        let athena = profiles?.profiles["athena"];

        let multiUpdates: any[] = [{
            profileRevision: athena?.rvn || 0,
            profileId: "athena",
            profileChangesBaseRevision: athena?.rvn || 0,
            profileChanges: [],
            profileCommandRevision: athena?.commandRevision || 0,
        }];

        const ver = getVersion(c);
        const body = await c.req.json();

        let lootResult: any[] = [
            { items: [] }
        ];
        let profileChanges: Object[] = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck =
            ver.build >= 12.2 ? profile.commandRevision : profile.rvn;
        let QueryRevision = c.req.query("rvn") || -1;

        if (!profile?.items) profile.items = {};
        if (!athena?.items) athena.items = {};

        const catalog = require("../../../static/data/storefront.json");

        function findOffer(offerId: any) {
            for (let storefront of catalog.storefronts) {
                let findOfferId = storefront.catalogEntries.find((i: any) => i.offerId == offerId);
                if (findOfferId) return { name: storefront.name, offerId: findOfferId };
            }
        }

        let findOfferId = findOffer(body.offerId) as any;

        if (/^BR(Daily|Weekly|Season)Storefront$/.test(findOfferId.name)) {

            for (let value of findOfferId.offerId.itemGrants) {
                const ID = v4();

                if (Object.values(athena.items).some((item: any) => item.templateId.toLowerCase() === value.templateId.toLowerCase())) {
                    return c.json(Solara.storefront.alreadyOwned, 400);
                }

                const Item = {
                    templateId: value.templateId,
                    attributes: { item_seen: false, variants: [] },
                    quantity: 1,
                };

                athena.items[ID] = Item;

                multiUpdates[0].profileChanges.push({
                    changeType: "itemAdded",
                    itemId: ID,
                    item: athena.items[ID],
                });

                lootResult[0].items.push({
                    itemType: Item.templateId,
                    itemGuid: ID,
                    itemProfile: "athena",
                    quantity: 1,
                });
            }

            const ID = v4();

            // profiles.profiles.common_core.stats.attributes.mtx_purchase_history.purchases.push({
            //     purchaseId: ID,
            //     offerId: `v2:/${ID}`,
            //     purchaseDate: new Date().toISOString(),
            //     undoTimeout: "9999-12-12T00:00:00.000Z",
            //     freeRefundEligible: false,
            //     fulfillments: [],
            //     lootResult: [
            //         {
            //             itemType: findOfferId.itemGrants.templateId,
            //             itemGuid: findOfferId.itemGrants.templateId,
            //             itemProfile: "athena",
            //             quantity: 1,
            //         },
            //     ],
            //     totalMtxPaid: findOfferId.price.originalPrice,
            //     metadata: {},
            //     gameContext: "",
            // });


            if (findOfferId.offerId.prices[0].currencyType.toLowerCase() === "mtxcurrency") {
                let paid = false;

                for (let key in profile.items) {
                    if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;

                    let currencyPlatform = profile.items[key].attributes.platform;
                    if (currencyPlatform.toLowerCase() !== profile.stats.attributes.current_mtx_platform.toLowerCase() &&
                        currencyPlatform.toLowerCase() !== "shared") continue;

                    if (profile.items[key].quantity < findOfferId.offerId.prices[0].finalPrice) {
                        return c.json(Solara.storefront.currencyInsufficient, 400);
                    }

                    profile.items[key].quantity -= findOfferId.offerId.prices[0].finalPrice;

                    profileChanges.push({
                        changeType: "itemQuantityChanged",
                        itemId: key,
                        quantity: profile.items[key].quantity,
                    });

                    paid = true;
                    break;
                }

                if (!paid && findOfferId.offerId.prices[0].finalPrice > 0) {
                    return c.json(Solara.storefront.currencyInsufficient, 400);
                }
            }
            profiles?.updateOne({
                $set: {
                    [`profiles.${c.req.query("profileId")}`]: profile,
                    [`profiles.athena`]: athena,
                }
            });
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();
        multiUpdates[0].profileRevision = athena.rvn;
        multiUpdates[0].profileCommandRevision = athena.commandRevision;
        profiles?.updateOne({
            $set: {
                [`profiles.${c.req.query("profileId")}`]: profile,
                [`profiles.athena`]: athena,
            }
        });

    //    if (QueryRevision != ProfileRevisionCheck) {
      //      profileChanges = [{ changeType: "fullProfileUpdate", profile }];
      //  }

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: c.req.query("profileId"),
            profileChangesBaseRevision: BaseRevision,
            profileChanges: profileChanges,
            notifications: [
                {
                    type: "CatalogPurchase",
                    primary: true,
                    lootResult: {
                        items: lootResult[0].items,
                    },
                },
            ],
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdates: multiUpdates,
            responseVersion: 1,
        });
    });
}