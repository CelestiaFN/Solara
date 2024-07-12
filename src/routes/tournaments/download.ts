import app from "../../";

export default function () {
  app.get("/api/v1/events/Fortnite/download/*", async (c) => {
    if (await c.req.json()) {
      console.log(await c.req.json())
    }
    return c.json([]);
  });
}
