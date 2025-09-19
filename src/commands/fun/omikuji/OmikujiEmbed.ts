import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { OmikujiResult } from '../../../services/OmikujiService.js';
import { config } from '../../../utils/config.js';

/**
 * おみくじコマンドのUIを生成するファクトリクラス
 */
class OmikujiEmbed {
    /**
     * おみくじの結果からEmbedを作成します。
     * @param interaction コマンドのインタラクション
     * @param result OmikujiServiceから取得した結果オブジェクト
     * @returns 作成されたEmbedBuilder
     */
    public create(interaction: ChatInputCommandInteraction, result: OmikujiResult): EmbedBuilder {
        const description = `
        **運勢**
        ${result.fortune}

        **願望:** ${result.hope}
        **失物:** ${result.lostItem}
        **学問:** ${result.learning}
        **争事:** ${result.conflict}
        **恋愛:** ${result.love}
        **病気:** ${result.disease}
        `;

        return new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}さんのおみくじの結果`)
            .setDescription(description)
            .setColor(Number(config.botColor))
            .setFooter({
                text: `実行者: ${interaction.user.displayName}`,
                iconURL: interaction.user.displayAvatarURL() || undefined
            });
    }
}

export default new OmikujiEmbed();
