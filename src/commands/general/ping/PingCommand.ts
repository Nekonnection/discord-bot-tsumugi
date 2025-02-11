import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
/**
 * Pingコマンド
 */
class PingCommands extends CommandInteraction {
    command = new SlashCommandBuilder().setName('ping').setDescription('Pingを表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const pingEmbed = this.createEmbed(interaction, 'Pingを測定中...', false);

        await interaction.reply({
            embeds: [pingEmbed],
            allowedMentions: { repliedUser: false }
        });

        const message: Message<boolean> = await interaction.fetchReply();
        const updatedPingEmbed = this.createEmbed(interaction, 'Pingを測定しました', true, message);

        await interaction.editReply({
            embeds: [updatedPingEmbed]
        });
    }
    /**
     * 埋め込みメッセージを作成します
     * @param interaction インタラクション
     * @param title タイトル
     * @param isUpdate アップデートかどうか
     * @param message メッセージ
     * @returns 埋め込みメッセージ
     */
    private createEmbed(interaction: ChatInputCommandInteraction, title: string, isUpdate: boolean, message?: Message<boolean>): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(Number(config.botColor))
            .setTimestamp()
            .setFooter({ text: 'コマンド送信日時', iconURL: interaction.user.avatarURL() || undefined });

        if (isUpdate && message) {
            embed.setFields(
                {
                    name: 'WebSocket Ping',
                    value: `${interaction.client.ws.ping}ms`
                },
                {
                    name: 'APIレイテンシ',
                    value: `${message.createdTimestamp - interaction.createdTimestamp}ms`
                }
            );
        }

        return embed;
    }
}

export default new PingCommands();
