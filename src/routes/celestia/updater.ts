import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.6",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.6_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1RVR0hEb0RzRVRXREtDa3g3cFVRMTY1dks5UWdYM1Q1TG9HSWwyYWNCbzVWVXJCVllVcVZWakREVk5DS092WGdzNmNwZkkwZUtQeTcza3hxbXR5Y0FJPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxNDIxNzkwCWZpbGU6Q2VsZXN0aWFfMC4yLjZfeDY0LXNldHVwLm5zaXMuemlwCjVjTGFEOHNMWllHTmZVQXBxQlloWHhBYlRBMTAvbDloVjVRbGZaRURZWXZGcUt1aTV3QndaSC9yQzVsZS80VFNKc3p1T0JTb0Q0NlgxY2hzSjAyRURBPT0K",
            "notes": null
          })
    })
}