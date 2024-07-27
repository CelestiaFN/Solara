import app from "../../"
import Friends from "../../database/models/friends";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import Tokens from "../../database/models/tokens";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.get("/fortnite/api/storefront/v2/gift/check_eligibility/recipient/:recipientId/offer/:offerId", verifyAuth, async (c) => {
        const catalog = require("../../../static/data/storefront.json");
        const params = await c.req.param()

        const authHeader: any = c.req.header("Authorization");

        if (!authHeader) {
            return c.json(Solara.authentication.invalidToken, 401);
        }

        const tokenStr = authHeader.split(' ').pop().trim();
        const token = await Tokens.findOne({ token: tokenStr });

        if (!token) {
            return c.json(Solara.authentication.invalidToken.variable([tokenStr]), 401);
        }

        function findOffer(offerId: any) {
          for (let storefront of catalog.storefronts) {
            let findOfferId = storefront.catalogEntries.find(
              (i: any) => i.offerId == offerId
            );
            if (findOfferId)
              return { name: storefront.name, offerId: findOfferId };
          }
        }
    
        let findOfferId = findOffer(params.offerId) as any;
        if (!findOfferId) return c.json(Solara.storefront.invalidItem, 404)
    
        let sender = await Friends.findOne({ accountId: token.accountId }).lean();
    
        if (!sender) return c.json(Solara.mcp.profileNotFound, 404)

        if (!sender.list.accepted.find((i: any) => i.accountId == params.recipientId) && params.recipientId != token.accountId) return c.json(Solara.friends.friendshipNotFound, 404)
    
        const profiles = await Profile.findOne({ accountId: params.recipientId });

        if (!profiles) return c.json(Solara.mcp.profileNotFound, 404)
    
        let athena = profiles.profiles["athena"];
    
        for (let itemGrant of findOfferId.offerId.itemGrants) {
            for (let itemId in athena.items) {
                if (itemGrant.templateId.toLowerCase() == athena.items[itemId].templateId.toLowerCase()) return c.json(Solara.storefront.invalidItem, 404)
            }
        }
    
        return c.json({
            price: findOfferId.offerId.prices[0],
            items: findOfferId.offerId.itemGrants
        });
    });
}