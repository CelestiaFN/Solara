import app from "../../"; 

export default function () {
    app.get("/api/launcher/sizes", async (c) => {
        return c.json({
            success: true,
            files: {
                "pakchunkCelestia0001-WindowsClient.pak": 48774023,
                "pakchunkCelestia0001-WindowsClient.sig": 4872,
            },
        });
    });
}
