import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.2",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.2_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL2JNNThQdGR2VzdsT3lvV2loNG1yaElKV0VGTVlUV1JrMzVNSDl1bnZCSWNBREtuUlUzZlRrZWhiRldGem12Wk5oc0NnOUFNU21SNEplVG1rMGF6Z3dVPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxMDcyNzM4CWZpbGU6Q2VsZXN0aWFfMC4yLjJfeDY0LXNldHVwLm5zaXMuemlwCjJtWVRoTjE0eFVuVFRrN25Uc0krWHJwOTBQU3phVlBrSXExZTY0N1BxM3VFcWlLMFQveXFtRDVFUHFuTTkrcWJiSWdpSU9kb1FwQXgwOHRxOXJ5QUR3PT0K",
            "notes": "\n - Added a feature to edit your username!"
          })
    })
}