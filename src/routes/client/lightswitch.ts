import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";

export default function () {
  app.get("/lightswitch/api/service/Fortnite/status", verifyAuth, async (c) => {
    const token = await Tokens.findOne({ token: c.req.header("authorization") })

    if (!token) return c.json(Solara.authentication.invalidHeader, 400)

    const user = await User.findOne({ accountId: token.accountId })

    return c.json({
      serviceInstanceId: "fortnite",
      status: "UP",
      message: "Fortnite is online",
      maintenanceUri: null,
      overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
      allowedActions: [],
      banned: user?.banned,
      launcherInfoDTO: {
        appName: "Fortnite",
        catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
        namespace: "fn",
      },
    });
  });

  app.get("/lightswitch/api/service/bulk/status", verifyAuth, async (c) => {
    const ah = c.req.header("authorization");
    const token = await Tokens.findOne({ token: ah?.replace("bearer ", "") })

    if (!token) return c.json(Solara.authentication.invalidHeader, 400)

    const user = await User.findOne({ accountId: token.accountId })

    return c.json([
      {
        serviceInstanceId: "fortnite",
        status: "UP",
        message: "fortnite is up.",
        maintenanceUri: null,
        overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
        allowedActions: ["PLAY", "DOWNLOAD"],
        banned: user?.banned,
        launcherInfoDTO: {
          appName: "Fortnite",
          catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
          namespace: "fn",
        },
      },
    ]);
  });
}