import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, time, TimestampStyles } from 'discord.js';

import pkg from '../../../../package.json' with { type: 'json' };
import ReadyEvent from '../../../events/ready.js';
import { client } from '../../../index.js';
import { config } from '../../../utils/config.js';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { logger } from '../../../utils/log.js';
import { CommandInteraction } from '../../base/command_base.js';

/**
 * Botコマンド
 */
class BotCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder().setName('bot').setDescription('Botの情報を表示します').setCategory('一般').setUsage('`/bot`');

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const embed = this.createEmbed(interaction);
            const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(this.createButtons());

            await interaction.editReply({
                embeds: [embed],
                components: [buttons]
            });
        } catch (error) {
            logger.error('Botコマンドの実行中にエラーが発生しました: ', error);
        }
    }

    /**
     * 埋め込みメッセージを作成します。
     * @param interaction インタラクション
     * @returns 埋め込みメッセージ
     */
    private createEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        const botCreatedAt = client.user?.createdAt ?? new Date();

        return new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.user.username}の情報`, iconURL: config.iconURL })
            .setColor(Number(config.botColor))
            .setThumbnail(config.iconURL)
            .addFields(
                { name: '名前', value: `${interaction.client.user.username} (Tsumugi Byousaki)`, inline: false },
                { name: '作成日', value: time(botCreatedAt, TimestampStyles.RelativeTime), inline: true },
                { name: 'バージョン', value: pkg.version, inline: true },
                { name: '導入サーバー数', value: ReadyEvent.checkTotalGuilds(), inline: true },
                { name: '総ユーザー数', value: ReadyEvent.checkTotalUsers(), inline: true }
            )
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
    }

    /**
     * ボタンを作成します。
     * @returns ボタンの配列
     */
    private createButtons(): ButtonBuilder[] {
        return [
            new ButtonBuilder().setLabel('Botを導入').setStyle(ButtonStyle.Link).setURL(config.inviteURL),
            new ButtonBuilder().setLabel('サポートサーバーに参加').setStyle(ButtonStyle.Link).setURL(config.supportGuildURL)
        ];
    }
}

export default new BotCommand();
