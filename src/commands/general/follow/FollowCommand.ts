import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, InteractionContextType, MessageFlags } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder';
/**
 * followコマンド
 */
class FollowCommand extends CommandInteraction {
    readonly command = new CustomSlashCommandBuilder()
        .setName('follow')
        .setDescription('Botからのお知らせをフォローして、チャンネルに通知するようにします。')
        .setCategory('一般')
        .setUsage('`/follow`')
        .setDefaultBotPermissions(PermissionFlagsBits.ManageChannels)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });
        const announcementChannel = await interaction.client.channels.fetch(config.announcementChannelId);
        if (announcementChannel && announcementChannel.type == ChannelType.GuildAnnouncement) {
            const channelId = interaction.channel?.id;
            if (!channelId) return;
            await announcementChannel.addFollower(channelId);
            await interaction.editReply({
                content: 'Botからのお知らせをフォローしました'
            });
        } else {
            await interaction.editReply({
                content: 'Botからのお知らせチャンネルが見つかりませんでした'
            });
        }
    }
}

export default new FollowCommand();
