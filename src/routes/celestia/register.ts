import app from "../..";
import { v4 as uuidv4 } from "uuid";
import Profile from "../../database/models/profiles";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import path, { dirname } from "path";
import Stats from "../../database/models/stats";
import { fileURLToPath } from "url";
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";

interface Profiles {
    [key: string]: Profiles;
}

export default async function () {

    async function createProfiles(accountId: any) {
        let profiles: Profiles = {};

        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const currentDirPath = dirname(currentFilePath);
        const profilesDirectory = path.join(
            currentDirPath,
            "..",
            "..",
            "..",
            "static",
            "profiles"
        );

        try {
            const files = await fs.readdir(profilesDirectory);

            await Promise.all(
                files.map(async (fileName) => {
                    const filePath = path.join(profilesDirectory, fileName);
                    const data = await fs.readFile(filePath, "utf8");
                    const profile = JSON.parse(data);

                    profile.accountId = accountId;
                    profile.created = new Date().toISOString();
                    profile.updated = new Date().toISOString();

                    profiles[profile.profileId] = profile;
                })
            );

            return profiles;
        } catch (error) {
            console.error("Error reading profiles directory:", error);
            throw error;
        }
    }

    app.post("/register", async (c) => {
        const { username, discordId } = await c.req.json();
        const body = await c.req.json()

        const accountId = uuidv4().replace(/-/gi, "");

        const generateRandomPassword = () => {
            const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let password = '';
            for (let i = 0; i < 4; i++) {
                password += letters.charAt(Math.floor(Math.random() * letters.length));
                password += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }
            return password;
        };

        let email;
        let password;
        
        if (body.email) email = body.email;
        if (!body.email) email = `${Math.floor(1000000 + Math.random() * 9000000)}@Celestiafn.org`
        if (body.password) password = body.password;
        if (!body.password) password = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(password, 10);
        const userProfile = await createProfiles(accountId);

        await User.create({
            discordId,
            accountId,
            username,
            email,
            password: hashedPassword,
            created: new Date(),
            banned: false,
            hasFL: false,
            role: "0",
            Reports: 0,
            hwid: null,
        }).then(async (user) => {
            await Profile.create({
                accountId: user.accountId,
                profiles: userProfile,
                created: new Date().toISOString(),
                access_token: "",
                refresh_token: "",
            });
            await Stats.create({
                created: new Date().toISOString(),
                accountId: user.accountId,
            });
        });

        return c.json({ text: "Account created!" })
    });
}