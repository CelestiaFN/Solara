import BaseCommand from "../helpers/BaseCommand";
import {
    CommandInteraction,
    type CacheType,
    ApplicationCommandOptionType,
} from "discord.js";
import User from "../../database/models/users";
import { v4 } from 'uuid'

export default class DisplaySecretCommand extends BaseCommand {
    data = {
        name: "ban",
        description: "Bans a user's account!",
        options: [
            {
                name: "discord",
                type: ApplicationCommandOptionType.User,
                description: "The user that will be banned!",
                required: true,
            },
            {
                name: "reason",
                type: ApplicationCommandOptionType.String,
                description: "The reason that the user will be banned!",
                required: true,
            },
        ]
    };

    async execute(interaction: CommandInteraction<CacheType>) {
        try {
            const targetUser = interaction.options.get("discord", true);
            const banReason = interaction.options.get("reason", true);
            const userId = targetUser?.user?.id;

            const user = await User.findOne({ discordId: userId });

            if (userId === "942494965219610717" || userId === "1015001768725323837") {
                await interaction.reply(`${targetUser.user?.username} can not be banned by \`${interaction.user.username}\` `);
                return;
            }

            if (!user) {
                await interaction.reply(`User has not played Celestia yet!`);
                return;
            }

            if (user?.banned == true) {
                await interaction.reply(`User \`${user?.username}\` is already banned from Celestia!`);
                return;
            }

            if (user) {
                user.banned = true;

                if (!user.banhistory) {
                    user.banhistory = []
                }
                
                user.banhistory.push({
                    Expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 80)).toISOString(),
                    Id: v4(),
                    IssuedBy: interaction.user.id,
                    Reason: banReason.value
                })

                await user.save()
            }
            try {
                await targetUser?.user?.send(`You have been banned from Celestia for reason \`${banReason.value}\`!`);
            } catch (error) {
                await interaction.reply(`Banned \`${user?.username}\` from Celestia for reason \`${banReason.value}\`, but failed to notify them.`);
            }

            await interaction.reply(`Banned \`${user?.username}\` from Celestia for reason \`${banReason.value}\`!`);
        } catch (error) {
            console.error(error)
            await interaction.reply(`An error has occured!`);
         }
    }
}
