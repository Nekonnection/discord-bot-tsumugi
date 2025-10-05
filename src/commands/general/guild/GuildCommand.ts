import { ChatInputCommandInteraction } from 'discord.js';

import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { CommandInteraction } from '../../base/command_base.js';
import GuildEmbed from './GuildEmbed.js';

class GuildCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder()
        .setName('guild')
        .setDescription('サーバー情報を表示します')
        .setCategory('一般')
        .setUsage('`/guild`');

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const embed = GuildEmbed.create(interaction);
        await interaction.editReply({ embeds: [embed] });
    }
}

export default new GuildCommand();
