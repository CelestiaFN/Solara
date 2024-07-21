import app from "../../"
import Sac from "../../database/models/sac";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.get("/affiliate/api/public/affiliates/slug/:slug", async (c) => {
        let slug = c.req.param("slug");
      
        const code = await Sac.findOne({ code_l: slug.toLowerCase() });
      
        if (!code) {
          return c.json(Solara.mcp.profileNotFound, 404)
        }
      
        return c.json({
          id: code.code,
          slug: code.code,
          displayName: code.code,
          status: "ACTIVE",
          verified: false
        }, 200);
    })
}