import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.9",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.9_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL2NFREZ4cEFRRVhjQTE1cjRpYXdZMDdydVBITTg3OFc2VkljUFB6UkJSdTN2R2VDOEJ4L2M5dVpaWWVuQ3N6Z3ZQcHRPWXRORDBQdXRyUDNQbjZWNHdNPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIzMjQ0MjYxCWZpbGU6Q2VsZXN0aWFfMS4wLjlfeDY0LXNldHVwLm5zaXMuemlwCnNPNEhaVnppVThFUTBrSjVscGFsajNFbW1XRiswenMycllFYmlDNS9ZMm9nbFdYS0plR1VJejVBbXFJYzhab1Y2M05pOXcrcUkySjJFR3ZuSThIcUJ3PT0K",
            "notes": null
          })
    })
}