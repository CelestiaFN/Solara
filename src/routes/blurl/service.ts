import app from "../..";

export default function () {
    app.get('/:blurl/master.blurl', async (c) => {
        return c.redirect("https://fortnite-vod.akamaized.net/GEviYjIhzVVzJufW/master.blurl");
      });
}