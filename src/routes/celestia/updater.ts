import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.4",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.4_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL2N4dzRzU2ZWTjVEN3dyTmhqWTJTd2NVNEc2TWFrTmk2YVl1UEhxR0o5MGgrVVJUSkFIdk5EWElGVjkrVHZ5QW5IWnV5UzlBVkcyb291dXltcEV5L0E4PQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxMTU4NTUyCWZpbGU6Q2VsZXN0aWFfMC4yLjRfeDY0LXNldHVwLm5zaXMuemlwCnhFaGpxeCtTVmE0Q3JzTVBiM0doT1VlWFE2Rnhtak5XSVZPZWhJR0VuSTBtS1RGL0VHUEVGSENKemtqcGlwL0Y4MUJaRURaTi9ESUEzVU5KNjdDWkN3PT0K",
            "notes": "\n - Added a feature to edit your username!"
          })
    })
}