import app from "../..";
import User from "../../database/models/users";
import Profile from "../../database/models/profiles";
import axios from "axios"
let athena = require("../../../static/profiles/athena.json");

export default function () {
    app.post("/hydro/gift/fl/:accountId", async (c) => {
        const fixedBackendValues = {
            "AthenaEmoji": "AthenaDance",
            "AthenaSpray": "AthenaDance",
            "AthenaToy": "AthenaDance",
            "AthenaPetCarrier": "AthenaBackpack",
            "AthenaPet": "AthenaBackpack",
            "SparksDrum": "SparksDrums",
            "SparksMic": "SparksMicrophone"
        } as any

        try {
            const resp = await axios.get("https://fortnite-api.com/v2/cosmetics");
            let data = resp.data.data;

            for (var mode in data) {
                if (mode == "lego") continue;

                data[mode].forEach((item: any) => {
                    if (item.id.toLowerCase().includes("random")) return;

                    if (mode == "tracks") item.type = { "backendValue": "SparksSong" };

                    if (fixedBackendValues.hasOwnProperty(item.type.backendValue)) item.type.backendValue = fixedBackendValues[item.type.backendValue];

                    let id = `${item.type.backendValue}:${item.id}`;
                    let variants: any = [];

                    if (item.variants) {
                        item.variants.forEach((obj: any) => {
                            variants.push({
                                "channel": obj.channel || "",
                                "active": obj.options[0].tag || "",
                                "owned": obj.options.map((variant: any) => variant.tag || "")
                            })
                        })
                    }

                    athena.items[id] = {
                        "templateId": id,
                        "attributes": {
                            "max_level_bonus": 0,
                            "level": 1,
                            "item_seen": true,
                            "xp": 0,
                            "variants": variants,
                            "favorite": false
                        },
                        "quantity": 1
                    }
                })
            }

            const accountId = c.req.param("accountId")

            const user = await User.findOne({ accountId: accountId })
            if (user?.hasFL == false) {
                await Profile.updateOne(
                    { accountId: accountId },
                    { $set: { "profiles.athena.items": athena.items } }
                );

                await User.updateOne(
                    { accountId: accountId },
                    { $set: { "hasFL": true } }
                );

                return c.json(athena.items, 200);
            } else {
                return c.json("User has Full Locker already!")
            }
        } catch (error) {
            console.error(error);
            return c.json({ error: "Internal Server Error" });
        }
    });
}

