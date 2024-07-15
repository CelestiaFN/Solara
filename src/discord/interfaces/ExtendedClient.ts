import type { Client, CommandInteraction } from "discord.js";

export interface Command {
  data: {
    name: string;
    description: string;
    options?: any[];
    defaultMemberPermissions?: any;
    dmPermission?: boolean;
  };
  execute(
    interaction: CommandInteraction,
    options: { ephemeral?: boolean },
  ): Promise<void> | Promise<any>;
}

export interface ExtendedClient extends Client {
  commands: Map<string, Command>;
}