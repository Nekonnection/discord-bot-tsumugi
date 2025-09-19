import { ChatInputCommandInteraction, EmbedBuilder, time, TimestampStyles } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { BotInfo } from '../../../services/BotInfoService.js';
import { config } from '../../../utils/config.js';

/**
 * Botコマンドの埋め込みメッセージを作成する
 */
class BotEmbed {
    private readonly embedFactory = new EmbedFactory();
    /**
     * Bot情報の埋め込みメッセージを作成する
     * @param interaction 元のインタラクション
     * @param botInfo BotInfoServiceから取得したBot情報
     * @returns 作成されたEmbedBuilder
     */
    public create(interaction: ChatInputCommandInteraction, botInfo: BotInfo): EmbedBuilder {
        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setAuthor({ name: `${botInfo.username}の情報`, iconURL: config.iconURL })
            .setThumbnail(config.iconURL)
            .addFields(
                { name: '名前', value: `${botInfo.username} (Tsumugi Byousaki)`, inline: false },
                { name: '作成日', value: time(botInfo.createdAt, TimestampStyles.RelativeTime), inline: true },
                { name: 'バージョン', value: botInfo.version, inline: true },
                { name: '導入サーバー数', value: botInfo.guildCount, inline: true },
                { name: '総ユーザー数', value: botInfo.userCount, inline: true }
            );
    }
}

export default new BotEmbed();
