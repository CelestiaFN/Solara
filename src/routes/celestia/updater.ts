import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.3",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.3_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1hZY1BiMUV0bXhzSjdiK08xUSs0cEp0RTMrbS81L3dITUIyZ0RMVkJHbDZFY3EwaklCSzlheG9mY0hjN21ENW9zTDVvRWhzSWVaa01WSVcwQmMyZncwPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxMTUyNjg0CWZpbGU6Q2VsZXN0aWFfMC4yLjNfeDY0LXNldHVwLm5zaXMuemlwCjR0NW5hcnpXanlmRjRkTVlLcXA4b0VneitMNFNBS2dIdnhsWEh0RDBlVGcyRkpPRVZqU3N2aytMN1JUdU5kYTU5VlI3Mzltd3l2V3ZHMFEzaXV3MkNnPT0K",
            "notes": "\n - Added a feature to edit your username!"
          })
    })
}