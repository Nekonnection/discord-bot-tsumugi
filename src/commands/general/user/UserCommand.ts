import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { CommandInteraction } from '../../base/command_base.js';
import UserEmbed from './UserEmbed.js';
/**
 * ユーザー情報表示コマンド
 */
class UserCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder()
        .setName('user')
        .setDescription('ユーザー情報を表示します')
        .setCategory('一般')
        .setUsage('`/user [user]`')
        .addUserOption((option) => option.setName('user').setDescription('ユーザーオブジェクト').setRequired(false)) as CustomSlashCommandBuilder;

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const user = interaction.options.getUser('user') ?? interaction.user;
        const member = (interaction.options.getMember('user') as GuildMember | null) ?? (interaction.member as GuildMember);

        const embed = UserEmbed.createUserInfoEmbed(user, member, interaction);
        await interaction.editReply({ embeds: [embed] });
    }
}

export default new UserCommand();
