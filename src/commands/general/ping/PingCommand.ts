import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';

class PingCommands extends CommandInteraction {
    command = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping pong!');
    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('Pong!');
    }
}

export default new PingCommands();