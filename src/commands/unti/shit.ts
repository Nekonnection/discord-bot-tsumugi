import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../base/command_base';
import CustomSlashCommandBuilder from '../../utils/CustomSlashCommandBuilder';
/**
 * Shitコマンド
 */
class ShitCommands extends CommandInteraction {
    command = new CustomSlashCommandBuilder().setName('shit').setDescription('💩を表示します').setCategory('うんち');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('💩');
    }
}

export default new ShitCommands();
