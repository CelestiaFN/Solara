import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.6",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.6_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1JVdXpKY2RMQlNVN01QdWVEZzljK1QvMWsvMDBvZlhieWtTN3MwM2FmR3VwOFI0REJvUGIrbWZHT2xrZDN4NUJ2V1ZjZEhUdGRmUWdVU1c3bStIWHdBPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyMjg4NzgxCWZpbGU6Q2VsZXN0aWFfMS4wLjZfeDY0X2VuLVVTLm1zaS56aXAKcXhXNWVTUDhEMkZQb3hYOVZlMko5TFZyVWtwckMvOFBGOE5HLzcwaDR1aWZEL2dQMlRVelNMYis4dnZDb29tS3Q4eGJDK1NSMVg0WmUwRE5JUExWQlE9PQo=",
            "notes": null
          })
    })
}