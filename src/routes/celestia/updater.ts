import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.7",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.7_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1YyL0JacVp3RWRjVjBqVEpubWFySE1BQktESkY0Vk9LWlFYa1pPaGR3U0pFM1lXVHV1VS9CY0ZramFuYlgxczRKeC9qamNsR28xdTk3ait0OTRZVmcwPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyMzU5MDM5CWZpbGU6Q2VsZXN0aWFfMS4wLjdfeDY0X2VuLVVTLm1zaS56aXAKb3l6OUZpKy96VmdNZHRTYUtCc3ZZbDdZc3dJa2JYazZNc0MvbFdSSDBFbXVuenY5N0lTMjRNNXlOTmNNVCs0YnZleG1SUjVPYkVySHBJVUNneURwQlE9PQo=",
            "notes": null
          })
    })
}