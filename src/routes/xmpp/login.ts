import app from "../..";
import Tokens from "../../database/models/tokens";

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

        c.text(xmlRes);
    });
}