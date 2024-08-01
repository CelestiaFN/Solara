import app from "../..";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import logger from "../../utils/logger/logger";
import jwt from "jsonwebtoken";

// note: replace with schema
interface Friend {
    accountId: string;
}
export default function () {
    app.get("/api/xmpp/auth", async (c) => {
        const authHeader = c.req.header("authorization");
        if (authHeader == null) return c.text("<failure/>");
        const headertoken = authHeader.replace("bearer ", "");
        const token = await Tokens.findOne({ token: headertoken });

        if (!token) return c.text("<failure/>");

        const friends: Friend[] = []; // todo: fetch

        let xmlRes = "<success><friends>";
        for (let friend of friends) {
            xmlRes += "<user>" + friend.accountId + "</user>";
        }
        xmlRes += "</friends></success>";

        return c.text(xmlRes);
    });

    app.post("/xmpp/api/token", async (c, next) => {
        const body = await c.req.json()
        const token: any = await jwt.decode(body.token)
        try {
          var userass = await User.findOne({
            email: token?.email,
          });
          if (userass !== null) {
            return c.json({
                accountId: userass.accountId,
                token: body.token,
              });
          } else {
           return c.json({ error: "User not found" });
          }
        } catch (err) {
          console.error(err);
          next();
        }
      });
}