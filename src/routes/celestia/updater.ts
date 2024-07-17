import app from '../../'

export default function () {
    app.get("/api/launcher/updater/:version", async (c) => {
        return c.json({
            "version": "0.2.5",
            "pub_date": "2020-09-18T12:29:53+01:00",
            "url": "https://cdn.itztiva.me/Celestia_0.2.5_x64-setup.nsis.zip",
            "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRNWxLVUZ2dERDL2R1NWc3aS9ZdGtrcUJlaWxIZlBCMnp0T0NVWSttcjNyTktIckhmRFJUU1VkbjFpYkp5THJzRTdVWnlxbzVPRnlDbUdVQ1VIMVBPOUNlNW55dEN1c1FjPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzIxMTcyNzMyCWZpbGU6Q2VsZXN0aWFfMC4yLjVfeDY0LXNldHVwLm5zaXMuemlwCnNsREgrTExldVBiREt2L0hwVUdQOWRzSUlmd05Qcm1YeTRjQ21JZFhyMkFhRzRQUENrUUJFT2lTZXBOeFZUTXo3VURiZTBuRENrWFZSaDBRT3BrRUFnPT0K",
            "notes": "\n - Added a feature to edit your username!"
          })
    })
}