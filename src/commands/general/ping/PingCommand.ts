import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';

import { config } from '../../../utils/config.js';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { CommandInteraction } from '../../base/command_base.js';
/**
 * Pingコマンド
 */
class PingCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder().setName('ping').setDescription('Pingを表示します').setCategory('一般').setUsage('`/ping`');

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const pingEmbed = this.createEmbed(interaction, 'Pingを測定中...', false);

        await interaction.editReply({
            embeds: [pingEmbed]
        });

        const message: Message = await interaction.fetchReply();
        const updatedPingEmbed = this.createEmbed(interaction, 'Pingを測定しました', true, message);

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
    private createEmbed(interaction: ChatInputCommandInteraction, title: string, isUpdate: boolean, message?: Message): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(Number(config.botColor))
            .setFooter({ text: 'コマンド送信日時', iconURL: interaction.user.displayAvatarURL() || undefined });

        if (isUpdate && message) {
            embed.setFields(
                {
                    name: 'WebSocket Ping',
                    value: `${String(interaction.client.ws.ping)}ms`
                },
                {
                    name: 'APIレイテンシ',
                    value: `${String(message.createdTimestamp - interaction.createdTimestamp)}ms`
                }
            );
        }

        return embed;
    }
}

export default new PingCommand();
