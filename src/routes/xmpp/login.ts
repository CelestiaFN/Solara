import app from "../..";
import Tokens from "../../database/models/tokens";

// note: replace with schema
interface Friend {
    accountId: string;
}
export default function () {
    app.post("/api/xmpp/auth", async (c) => {
        let headertoken = c.req.header("authorization")!.replace("bearer ", "");
        let token = await Tokens.findOne({ token: headertoken })

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