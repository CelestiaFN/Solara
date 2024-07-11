import app from "../..";

export default function () {
    app.get("/api/launcher/news", async (c) => {
        return c.json([
            {
                "icon": "HiHeart",
                "title": "Hydro Donator Testing",
                "body": "Thank you for donating to Hydro! This limited time test is to see how the servers handle the new season! If you experience any issues, please report them in our Discord server. Thank you for your support!",
                "colouredIcon": true,
            },
            {
                "icon": "HiOutlineLightningBolt",
                "title": "Hydro Vbuck Testing",
                "body": "free vbuc code generator 20234 not clickbait!!!",
            }
        ]);
    });
}