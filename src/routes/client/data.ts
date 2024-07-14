import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import fs from 'node:fs'
import path from 'node:path'

export default function () {
    app.get("/content/api/pages/fortnite-game", async (c) => {
        const ver = getVersion(c);
        const contentpages = JSON.parse(fs.readFileSync(path.join(__dirname, "../../../static/data/contentpages.json"), "utf-8"));

        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = `season${ver.season}`;
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = `season${ver.season}`;
        contentpages.emergencynoticev2.emergencynotices.emergencynotices[0].title = `${Bun.env.EMERGENCY_NOTICE_TITLE}`;
        contentpages.emergencynoticev2.emergencynotices.emergencynotices[0].body = `${Bun.env.EMERGENCY_NOTICE_BODY}`;
        contentpages.emergencynotice.news.messages[0].title = `${Bun.env.EMERGENCY_NOTICE_TITLE}`;
        contentpages.emergencynotice.news.messages[0].body = `${Bun.env.EMERGENCY_NOTICE_BODY}`;

        if (ver.season == 10) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "summer";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "summer";
        }

        if (ver.build == 11.31 || ver.build == 11.4) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "Winter19";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "Winter19";
        }

        if (ver.season == 20) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage =
                "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg";
        }

        if (ver.season == 21) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage =
                "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg";
        }

        if (ver.build == 29.2) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage =
                "https://cdn2.unrealengine.com/br-lobby-ch5s2-4096x2304-a0879ccdaafcontentpages.jpg";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "defaultnotris";
        }

        return c.json(contentpages);
    });
}