import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.2",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.2_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1RwbTcrRU16YXBaS0NtdXFsOHpDQk1RWk9UbUVZbEN5ZlNjMURweVdFR2NPYy9qd0pKVjZ5dkJab0dwNkxETXRaZXA3b0drRmgwTlI1ZmQ0dU5kSEFBPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyMTk0NjgwCWZpbGU6Q2VsZXN0aWFfMS4wLjJfeDY0X2VuLVVTLm1zaS56aXAKUHE2WkxCZFNEb083QjVZV28vRVd6aWt0UmdSUkdFV21lZnVkVFZKc2FPeWltRThBT3VsenpDNHhQeFMvdWxhMGgyUkFyVWZ5NXR0anhwTTdwVXV4Q2c9PQo=",
            "notes": null
          })
    })
}