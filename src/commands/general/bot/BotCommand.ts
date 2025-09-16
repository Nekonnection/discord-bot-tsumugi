import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    time,
    TimestampStyles
} from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { client } from '../../..';
import { totalGuilds, totalUsers } from '../../../events/ready';
import { config } from '../../../utils/config';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder';
import pkg from '../../../../package.json';
import { logger } from '../../../utils/log';

/**
 * Botコマンド
 */
class BotCommand extends CommandInteraction {
    readonly command = new CustomSlashCommandBuilder()
        .setName('bot')
        .setDescription('Botの情報を表示します')
        .setCategory('一般')
        .setUsage('`/bot`');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
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
        const botCreatedAt = client.user?.createdAt || new Date();

        return new EmbedBuilder()
            .setAuthor({ name: `${interaction.client.user?.username}の情報`, iconURL: config.iconURL })
            .setColor(Number(config.botColor))
            .setThumbnail(config.iconURL)
            .addFields(
                // addFieldsに配列を渡すことで、より簡潔に記述できます。
                { name: '名前', value: `${interaction.client.user?.username} (Tsumugi Byousaki)`, inline: false },
                { name: '作成日', value: time(botCreatedAt, TimestampStyles.RelativeTime), inline: true },
                { name: 'バージョン', value: pkg.version, inline: true },
                { name: '導入サーバー数', value: totalGuilds.toString(), inline: true },
                { name: '総ユーザー数', value: totalUsers.toString(), inline: true }
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