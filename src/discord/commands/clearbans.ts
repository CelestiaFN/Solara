import BaseCommand from "../helpers/BaseCommand";
import {
    CommandInteraction,
    type CacheType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    PermissionsBitField,
} from "discord.js";
import User from "../../database/models/users";

export default class ClearBanHistoryCommand extends BaseCommand {
    data = {
        name: "clearbans",
        description: "Clears the ban history of a user!",
        options: [
            {
                name: "discord",
                type: ApplicationCommandOptionType.User,
                description: "The user whose ban history will be cleared!",
                required: true,
            }
        ],
    };

    async execute(interaction: CommandInteraction<CacheType>) {
        try {
            const targetUser = interaction.options.get("discord", true);
            const userId = targetUser?.user?.id;

            const user = await User.findOne({ discordId: userId });

            const perms = interaction.memberPermissions as PermissionsBitField;

            if (!perms || !perms.has(PermissionFlagsBits.BanMembers)) {
                await interaction.reply("You do not have permission to use this command.");
                return;
            }

            if (!user) {
                await interaction.reply(`User has not played Celestia yet!`);
                return;
            }

            await User.updateOne(
                { discordId: userId },
                {
                    $set: {
                        banhistory: []
                    }
                }
            );

            await interaction.reply(`Cleared ban history for \`${user?.username}\`!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`An error has occurred!`);
        }
    }
}
