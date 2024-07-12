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

        const ver = getVersion(c);
        const body = await c.req.json();
        const applyProfileChanges: any[] = [];
        const notifications: any[] = [];
        const multiUpdates: any[] = [];
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

                applyProfileChanges.push({
                    changeType: "itemAdded",
                    itemId: ID,
                    item: athena.items[ID],
                });

                multiUpdates.push({
                    changeType: "itemAdded",
                    itemId: ID,
                    item: athena.items[ID],
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

                    applyProfileChanges.push({
                        changeType: "itemQuantityChanged",
                        itemId: "Currency:MtxPurchased",
                        quantity: profiles.profiles.common_core.items["Currency:MtxPurchased"].quantity,
                      });

                    paid = true;
                    break;
                }

                if (!paid && findOfferId.offerId.prices[0].finalPrice > 0) {
                    return c.json(Solara.storefront.currencyInsufficient, 400);
                }
            }
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();
        profiles?.updateOne({
            $set: {
                [`profiles.${c.req.query("profileId")}`]: profile,
                [`profiles.athena`]: athena,
            }
        });

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: c.req.query("profileId"),
            profileChangesBaseRevision: BaseRevision,
            profileChanges: applyProfileChanges,
            notifications: [
                {
                  type: "CatalogPurchase",
                  primary: true,
                  lootResult: {
                    items: notifications,
                  },
                },
              ],
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: [
                {
                  profileRevision: athena.rvn,
                  profileId: "athena",
                  profileChangesBaseRevision: BaseRevision,
                  profileChanges: multiUpdates,
                  profileCommandRevision: athena.commandRevision,
                },
              ],
            responseVersion: 1,
        });
    });
}