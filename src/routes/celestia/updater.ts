import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.8",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.8_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1RLQ2RyMUNoZkdNaXhnNDJTeHhpRmM2ZHZaa0dwTHQxSDBZY2s2MWpMWXdZU2ZhVDBOYi9TNE5vT3VoK1FpREJuU3FrellxSmZXcExiQm5YU3VlbHdZPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyNDg4NTkxCWZpbGU6Q2VsZXN0aWFfMS4wLjhfeDY0X2VuLVVTLm1zaS56aXAKcUFXQUZHeE1CZlZZNG1qZDJRdGxzMlVkaHMyNkxJRXB6Z0tTNDBLRFQvakJXaC9KNGk3UGVNS2F6d0puRjVFZGJDRGxmUnV2M1o3OXpORE44WEk3Q2c9PQo=",
            "notes": null
          })
    })
}