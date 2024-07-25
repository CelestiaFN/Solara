import app from "../..";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { updateTokens } from "../../utils/functions/updateTokens";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Solara } from "../../utils/errors/Solara";
import { config } from "../..";

export default function () {
  app.post("/api/launcher/code", async (c) => {
    let token = c.req.header("authorization");
    const body: any = await c.req.json();
    if (!token) {
      return c.text("No token set in auth header!");
    }
    token = token.split(" ")[1];
    if (!token) {
      return c.json({ success: false, code: null });
    }
    let user: any;
    try {
      user = jwt.verify(token, `${Bun.env.JWT_SECRET}`);
    } catch (error) {
      console.error("Error jwt:", error);
      return c.text("Invalid token!");
    }
    if (!user || !user.accountId) {
      return c.text("Invalid token!");
    }
    if (Boolean(config.MAINTENANCE) == true) {
      return c.json(Solara.authentication.authenticationFailed, 404)
    }
    const existingCode = await Tokens.findOne({ accountId: user.accountId, type: "launcher_code" });
    if (existingCode) {
      return c.json({ success: true, code: existingCode.token });
    }

    const existingUser = await User.findOne({ accountId: user.accountId })

    if (!existingUser) return c.json(Solara.account.accountNotFound, 404)

    const code = uuidv4().replace(/-/gi, "");

    if (body.type === "launcher_code") {
      updateTokens(user.accountId, "launcher_code", code, [
        "launcher:code DELETE",
      ]);
      return c.json({ success: true, code: code });
    } else {
      updateTokens(user.accountId, "exchange_code", code, [
        "exchange:code DELETE",
      ]);
      return c.json({ success: true, code: code });
    }
  });
}
