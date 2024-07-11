import app from "../../";

export default function () {
  app.get("/api/v1/events/Fortnite/download/*", async (c) => {
    return c.json([]);
  });
}
