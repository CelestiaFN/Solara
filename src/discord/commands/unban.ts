import BaseCommand from "../helpers/BaseCommand";
import {
CommandInteraction,
    type CacheType,
        ApplicationCommandOptionType,
        PermissionsBitField,
        PermissionFlagsBits,
} from "discord.js";
import User from "../../database/models/users";

interface BanEntry {
    Expiry: string;
    Id: string;
    IssuedBy: string;
    Reason: string;
}

export default class UnbanCommand extends BaseCommand {
    data = {
        name: "unban",
        description: "Unbans a user's account!",
        options: [
            {
                name: "discord",
                type: ApplicationCommandOptionType.User,
                description: "The user that will be unbanned!",
                required: true,
            }
        ]
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

            if (!user.banned) {
                await interaction.reply(`User \`${user?.username}\` is not banned from Celestia!`);
                return;
            }

            if (user.banhistory) {
                user.banhistory.forEach((ban: BanEntry) => {
                    ban.Expiry = new Date().toISOString();
                });
            }

            await User.updateOne(
                { discordId: userId },
                {
                    $set: {
                        banned: false,
                        banhistory: user.banhistory,
                    }
                }
            );

            try {
                await targetUser?.user?.send(`You have been unbanned from Celestia!`);
            } catch (error) {
                console.error(error);
                await interaction.reply(`Unbanned \`${user?.username}\` from Celestia, but failed to notify them.`);
                return;
            }

            const channelId = "1264229342842716241";
            const channel = interaction.guild?.channels.cache.get(channelId) as any | undefined;
            if (channel) {
                await channel.send({
                    embeds: [{
                        title: "User Unbanned",
                        description: `\`${user?.username}\` has been unbanned from Celestia!`,
                        color: 0x19C41C,
                        fields: [
                            {
                                name: "User",
                                value: `<@${user?.discordId}>`,
                                inline: false,
                            },
                            {
                                name: "Account ID",
                                value: user?.accountId || "N/A",
                                inline: false,
                            },
                            {
                                name: "HWID",
                                value: user?.hwid || "N/A",
                                inline: false,
                            },
                            {
                                name: "Issuer",
                                value: `<@${interaction.user.id}>`,
                                inline: false,
                            },
                        ],
                    }],
                });
            }

            await interaction.reply(`Unbanned \`${user?.username}\` from Celestia!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`An error has occurred!`);
        }
    }
}
