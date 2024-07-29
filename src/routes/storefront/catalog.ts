import app from "../..";
import fs from "fs";
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import path from "node:path";

export default function () {
  app.get("/fortnite/api/storefront/v2/catalog", verifyAuth, async (c) => {
    const catalogPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "static",
      "data",
      "catalog.json"
    );
    const storefrontPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "static",
      "data",
      "storefront.json"
    );

    let catalog: any = {};
    const catalogData: any = fs.readFileSync(catalogPath);
    const storefrontData: any = fs.readFileSync(storefrontPath);

    catalog = JSON.parse(catalogData);
    const storefront = JSON.parse(storefrontData);

    const tomorrowAtMidnight = new Date();
    tomorrowAtMidnight.setDate(tomorrowAtMidnight.getDate() + 1);
    tomorrowAtMidnight.setHours(0, 0, 0, 0);
    const isoDate = tomorrowAtMidnight.toISOString();
    catalog.expiration = isoDate;
    catalog.storefronts.push(...storefront.storefronts);

    const ver = getVersion(c)
    
    if (ver.build == Bun.env.PUBLICVER as any) {
      return c.json(catalog);
    } else {
      return c.json([], 200)
    }
  });
}
