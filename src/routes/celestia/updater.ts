import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.7",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.7_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1EzRXdOM3laMjlZME9EbUVDNDNOc1FFUDNhNUI0SUxDbjRQRExZQXhSaS95TzNOWEJ3WnRNQlNET0NNcTV0alBubHdnMmRIb0l3NHRXbkh2SStDOXdFPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxNDg1MjE4CWZpbGU6Q2VsZXN0aWFfMC4yLjdfeDY0LXNldHVwLm5zaXMuemlwCm1Xd0s4bFE3RGh5RTZXUWt3VGVqbVRvL1Jlb09VUjZhNHhCV052NHAxM1JjMFR6QmtybFRBc2tKUnd3czRCM1NBOUpUaXI4b3g1SmR6MThxTnVKWUNnPT0K",
            "notes": null
          })
    })
}