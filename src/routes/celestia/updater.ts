import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.1",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.1_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1ZFWDJlREZnRmpTRURvdzBveGV4eW5FdFphaDlYYldVeVlia0kwSUZXdkVFWkQ1RGNqenJsVTl6cGJVc0ZnVThobGZBWW1WTWFCMjcvbjRoSE80anc0PQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyMDM2NTczCWZpbGU6Q2VsZXN0aWFfMS4wLjFfeDY0X2VuLVVTLm1zaS56aXAKejJMZ2cxY3lZYVpZNUkyc3phRzNHdk1LbmFGNjZtQmV1bjdFVVZwa3FyVHp1VVZLVUg2ckVWZENlNm9pUkFnUmoxOVppdCtCSmRuTUI0M0laYXdBQ1E9PQo=",
            "notes": null
          })
    })
}