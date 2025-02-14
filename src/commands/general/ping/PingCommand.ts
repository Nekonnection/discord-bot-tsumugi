import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
/**
 * Pingコマンド
 */
class PingCommand extends CommandInteraction {
    readonly category = '一般';
    readonly permission = null;
    readonly command = new SlashCommandBuilder().setName('ping').setDescription('Pingを表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const pingEmbed = await this.createEmbed(interaction, 'Pingを測定中...', false);

        await interaction.editReply({
            embeds: [pingEmbed]
        });

        const message: Message<boolean> = await interaction.fetchReply();
        const updatedPingEmbed = await this.createEmbed(interaction, 'Pingを測定しました', true, message);

        await interaction.editReply({
            embeds: [updatedPingEmbed]
        });
    }
    /**
     * 埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @param title タイトル
     * @param isUpdate アップデートかどうか
     * @param message メッセージ
     * @returns 埋め込みメッセージ
     */
    private async createEmbed(
        interaction: ChatInputCommandInteraction,
        title: string,
        isUpdate: boolean,
        message?: Message<boolean>
    ): Promise<EmbedBuilder> {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(Number(config.botColor))
            .setFooter({ text: 'コマンド送信日時', iconURL: interaction.user.displayAvatarURL() || undefined });

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

export default new PingCommand();
