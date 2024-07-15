import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.1",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.1_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1lvTzZGMEVUQzdwTVlieC85UXA1aUtGdU54M1RXaVUxTkE3alJWTlhDZTFaTitGZUIyK2twUGZaeGNidmVhQ2xYNUIxOCt0dzlhRjdyQ243OUNOakFVPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxMDYxODk4CWZpbGU6Q2VsZXN0aWFfMC4yLjFfeDY0LXNldHVwLm5zaXMuemlwCnBmNkFsVTJNOTRFaU9sblZ6Ym9FSHpqRWtpc2xZY0VkTE9OZUdLcjFqWkY1ZFIyTzhYcGRKUmNNYlZSdi95bzZEQzVSRFdia0JUaFFXQjVpOEdaR0FBPT0K",
            "notes": "Tons of new things to the launcher and also launcher has been fully revamped! \n - Temp removed downloader \n - Launcher is now smaller \n - Revamped Homepage"
          })
    })
}