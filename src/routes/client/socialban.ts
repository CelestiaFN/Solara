import app from "../..";

export default function () {
    app.get("/socialban/api/public/v1/*", (c) => {
        return c.json({
            "bans": [],
            "warnings": []
        });
    });
}