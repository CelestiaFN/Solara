import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "1.0.0",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.celestiafn.com/Celestia_1.0.0_x64_en-US.msi.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL1htVWxQcjlIZWRMS3RrYXhOcnlyOFhrRlozQ2I3M2h6ZjRmNzR2NUFESmpGcDBYK0N1NytpZ2FGa0twQWtTNStqZDZVN0llTzJad1pwY3BlVit5endnPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIyMDEwNjY1CWZpbGU6Q2VsZXN0aWFfMS4wLjBfeDY0X2VuLVVTLm1zaS56aXAKNEZ3N2JlNVl0RXdmdWtGbnNXVGVocUl6NGZBaEJ2MzNEYUFnR0R1dmQ3UjhYSnR5L1lOSGZsQy9ZNjlIRndyV2pYY3FwSDhBdTJJQU9yOFppdWRwQ3c9PQo=",
            "notes": null
          })
    })
}