import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.8",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.8_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1lRa2NrcDc2akVMR2w2K1RQbXc0ekJBUWtxQW5odklHR2VrMytHYjhsano4R3hxVFlRMERMZ3duVXpubkdXMDdodkxQdDZRRzkyZlB4R0hSdkxCbGdzPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxNzYwMjkzCWZpbGU6Q2VsZXN0aWFfMC4yLjhfeDY0LXNldHVwLm5zaXMuemlwCjN1a2VGN293NE9wOXlrVnZjdUtyWlp0VXpLc1RpbDJHWm5JRTdZN1lscW10dW43YStGc09TSWg1TVFSYVB1TytlY3A0MjY4WEp5bUZZMmltUU13ZkFBPT0K",
            "notes": null
          })
    })
}