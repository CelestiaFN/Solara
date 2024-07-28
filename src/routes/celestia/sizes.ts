import app from "../../"; 

export default function () {
    app.get("/api/launcher/sizes", async (c) => {
        return c.json({
            success: true,
            files: {
                "pakchunkCelestia-WindowsClient.pak": 48774023,
                "pakchunkCelestia-WindowsClient.sig": 4872,
            },
        });
    });
}
