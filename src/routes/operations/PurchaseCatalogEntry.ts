import app from "../..";
import { v4 as uuidv4 } from "uuid";
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import axios from "axios";
import { Solara } from "../../utils/errors/Solara";
import fs from "node:fs";

export default function () {
  app.post("/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry", verifyAuth, async (c) => {
    const profiles = (await Profile.findOne({
      accountId: c.req.param("accountId"),
    })) as any;
    const query = c.req.query();

    let profile = profiles.profiles[query.profileId];
    let athena = profiles.profiles["athena"];

    let multiUpdate: any = [
      {
        profileRevision: athena.rvn || 0,
        profileId: "athena",
        profileChangesBaseRevision: athena.rvn || 0,
        profileChanges: [],
        profileCommandRevision: athena.commandRevision || 0,
      },
    ];

    const ver = getVersion(c);
    const body = await c.req.json();

    let Notifications: any = [];
    let profileChanges: any = [];

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
      case /^BR(Daily|Weekly|Season)Storefront$/.test(findOfferId.name):
        let notification: any = {
          type: "CatalogPurchase",
          primary: true,
          lootResult: {
            items: [],
          },
        };

        for (let value of findOfferId.offerId.itemGrants) {
          const ID = uuidv4();

            let itemExists = Object.values(athena.items).some(
            (item: any) =>
              item && item.templateId && item.templateId.toLowerCase() === value.templateId.toLowerCase()
            );
          
          if (itemExists) return c.json(Solara.storefront.alreadyOwned, 400);
          const cleanedTemplateId = value.templateId.toLowerCase().replace(/(athenacharacter|athenabackpack|athenapickaxe|athenaglider|athenadance):/, '');
          let variants: any = [];

          if (value.templateId.includes("AthenaCharacter") || value.templateId.includes("AthenaBackpack")) {
            const resp = await axios.get(`https://fortnite-api.com/v2/cosmetics/br/${cleanedTemplateId}`);
            const data = resp.data.data;
        
            if (!data) {
                return null;
            }
        
            if (data.variants) {
                data.variants.forEach((obj: any) => {
                    variants.push({
                        "channel": obj.channel || "",
                        "active": obj.options[0].tag || "",
                        "owned": obj.options.map((variant: any) => variant.tag || "")
                    });
                });
            }
          }

          const Item = {
            templateId: value.templateId,
            attributes: {
              item_seen: false,
              variants: variants,
            },
            quantity: 1,
          };

          athena.items[ID] = Item;

          multiUpdate[0].profileChanges.push({
            changeType: "itemAdded",
            itemId: ID,
            item: athena.items[ID],
          });

          notification.lootResult.items.push({
            itemType: Item.templateId,
            itemGuid: ID,
            itemProfile: "athena",
            quantity: 1,
          });
        }

        Notifications.push(notification);

        profiles.profiles.common_core.stats.attributes.mtx_purchase_history.purchases.push(
          {
            purchaseId: body.offerId,
            offerId: `v2:/${body.offerId}`,
            purchaseDate: new Date().toISOString(),
            undoTimeout: "9999-12-12T00:00:00.000Z",
            freeRefundEligible: false,
            fulfillments: [],
            lootResult: [
              {
                itemType: findOfferId.offerId.itemGrants[0].templateId,
                itemGuid: findOfferId.offerId.itemGrants[0].templateId,
                itemProfile: "athena",
                quantity: 1,
              },
            ],
            totalMtxPaid: findOfferId.offerId.prices[0].originalPrice,
            metadata: {},
            gameContext: "",
          }
        );

        if (
          findOfferId.offerId.prices[0].currencyType.toLowerCase() ===
          "mtxcurrency"
        ) {
          let paid = false;

          for (let key in profile.items) {
            if (
              !profile.items[key].templateId
                .toLowerCase()
                .startsWith("currency:mtx")
            )
              continue;

            let currencyPlatform = profile.items[key].attributes.platform;
            if (
              currencyPlatform.toLowerCase() !==
                profile.stats.attributes.current_mtx_platform.toLowerCase() &&
              currencyPlatform.toLowerCase() !== "shared"
            )
              continue;

            if (
              profile.items[key].quantity <
              findOfferId.offerId.prices[0].finalPrice
            )
              return c.json(Solara.storefront.currencyInsufficient, 400);

            profile.items[key].quantity -=
              findOfferId.offerId.prices[0].finalPrice;

            profileChanges.push({
              changeType: "itemQuantityChanged",
              itemId: key,
              quantity: profile.items[key].quantity,
            });

            paid = true;
            break;
          }

          if (!paid && findOfferId.offerId.prices[0].finalPrice > 0)
            return c.json(Solara.storefront.currencyInsufficient, 400);

          if (multiUpdate[0].profileChanges.length > 0) {
            athena.rvn += 1;
            athena.commandRevision += 1;
            athena.updated = new Date().toISOString();

            multiUpdate[0].profileRevision = athena.rvn;
            multiUpdate[0].profileCommandRevision = athena.commandRevision;
          }
        }

        if (profileChanges.length > 0) {
          profile.rvn += 1;
          profile.commandRevision += 1;
          profile.updated = new Date().toISOString();

          await profiles.updateOne({
            $set: {
              [`profiles.${query.profileId}`]: profile,
              [`profiles.athena`]: athena,
            },
          });
        }

        if (
          query.rvn !==
          (ver.build >= 12.2 ? profile.commandRevision : profile.rvn)
        ) {
          profileChanges = [
            {
              changeType: "fullProfileUpdate",
              profile: profile,
            },
          ];
        }

        return c.json({
          profileRevision: profile.rvn || 0,
          profileId: c.req.query("profileId"),
          profileChangesBaseRevision: profile.rvn,
          profileChanges: profileChanges,
          notifications: Notifications,
          profileCommandRevision: profile.commandRevision || 0,
          serverTime: new Date().toISOString(),
          multiUpdate: multiUpdate,
          responseVersion: 1,
        });
    }

    return c.json(Solara.storefront.invalidItem, 400);
  });
}
