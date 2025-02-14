import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
/**
 * followコマンド
 */
class FollowCommand extends CommandInteraction {    
    readonly category = '一般';
    readonly permission = [PermissionsBitField.Flags.ManageChannels];
    readonly command = new SlashCommandBuilder().setName('follow').setDescription('Botからのお知らせをフォローして、チャンネルに通知するようにします。');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({
            ephemeral: true
        });
        const announcementChannel = await interaction.client.channels.fetch(config.announcementChannelId);
        if (announcementChannel && announcementChannel.type == ChannelType.GuildAnnouncement) {
            const channelId = interaction.channel?.id;
            if (!channelId) return;
            await announcementChannel.addFollower(channelId);
            await interaction.editReply({
                content: "Botからのお知らせをフォローしました",
            });
        } else {
            await interaction.editReply({
                content: "Botからのお知らせチャンネルが見つかりませんでした"
            });
        }
    }
}

export default new FollowCommand();
