import app from "../../";
import { config } from "../.."; 

export default function () {
    app.get("/api/oauth/discord", async (c) => {
        if (config.MAINTENANCE === `true`) {
            return c.html(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Maintenance</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            font-family: Arial, sans-serif;
                            background-color: #535252;
                        }
                        .container {
                            text-align: center;
                        }
                        .message {
                            font-size: 24px;
                            color: white;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="message">
                            Servers are offline for maintenance. Please check back later!
                        </div>
                    </div>
                </body>
                </html>
            `);
        }

        return c.redirect("https://discord.com/oauth2/authorize?client_id=1260815476695502848&response_type=code&redirect_uri=https%3A%2F%2Fcelestiafn.com%2Fapi%2Foauth%2Fdiscord%2Fcallback%2F&scope=identify+email+guilds");
    });
}
