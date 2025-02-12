import {
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    time,
    TimestampStyles,
    ActionRowBuilder
} from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
import { client } from '../../..';
import path from 'path';
import { promises as fs } from 'fs';
import { totalGuilds, totalUsers } from '../../../events/ready';
/**
 * Botコマンド
 */
class BotCommand extends CommandInteraction {
    category = '一般';
    permission = null;
    command = new SlashCommandBuilder().setName('bot').setDescription('Botの情報を表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const embed = await this.createEmbed(interaction);
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(await this.createButtons());
        await interaction.editReply({
            embeds: [embed],
            components: [buttons]
        });
    }
    /**
     * 埋め込みメッセージを作る関数
     * @param interaction インタラクション
     * @returns 埋め込みメッセージ
     */
    private async createEmbed(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
        const botCreatedAt = client.user?.createdAt || new Date();
        const packageJsonPath = path.join(__dirname, '../../../../package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

        return new EmbedBuilder()
            .setAuthor({ name: '猫咲 紬の情報', iconURL: config.iconURL })
            .setColor(Number(config.botColor))
            .addFields({
                name: '名前',
                value: '猫咲 紬 (Tsumugi Byousaki)',
                inline: false
            })
            .addFields({
                name: '作成日',
                value: time(botCreatedAt, TimestampStyles.RelativeTime),
                inline: true
            })
            .addFields({
                name: '作成者',
                value: '<@655572647777796097>',
                inline: true
            })
            .addFields({
                name: 'バージョン',
                value: packageJson.version,
                inline: true
            })
            .addFields({
                name: 'Bot導入数',
                value: totalGuilds.toString(),
                inline: true
            })
            .addFields({
                name: '総ユーザー数',
                value: totalUsers.toString(),
                inline: true
            })
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() || undefined })
            .setThumbnail(config.iconURL);
    }
    /**
     * ボタンを作る関数
     * @returns ボタン
     */
    private async createButtons(): Promise<ButtonBuilder[]> {
        return [
            new ButtonBuilder().setLabel('Botを導入').setStyle(ButtonStyle.Link).setURL(config.inviteURL),
            new ButtonBuilder().setLabel('サポートサーバーに参加').setStyle(ButtonStyle.Link).setURL(config.supportGuildURL)
        ];
    }
}

export default new BotCommand();
