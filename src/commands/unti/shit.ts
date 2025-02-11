import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../base/command_base';
/**
 * Shitコマンド
 */
class ShitCommands extends CommandInteraction {
    category = 'うんち';
    command = new SlashCommandBuilder().setName('shit').setDescription('💩を表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('💩');
    }
}

export default new ShitCommands();
