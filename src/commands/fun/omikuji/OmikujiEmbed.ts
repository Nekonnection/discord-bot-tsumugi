import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { OmikujiResult } from '../../../services/OmikujiService.js';

/**
 * おみくじコマンドの埋め込みメッセージを作成する
 */
class OmikujiEmbed {
    private readonly embedFactory = new EmbedFactory();
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

        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setTitle(`${interaction.user.displayName}さんのおみくじの結果`)
            .setDescription(description);
    }
}

export default new OmikujiEmbed();
