import { EmbedBuilder, User } from 'discord.js';

import { EmbedFactory } from '../../factories/EmbedFactory.js';

interface PrismaKeyword {
    trigger: string;
    responses: string | string[];
}

class KeywordEmbed {
    private embedFactory = new EmbedFactory();
    private readonly maxDescriptionLength = 4096;

    /**
     * キーワードリストからEmbedの配列を生成します。
     * 文字数制限を超えた場合は、自動的に複数のEmbedに分割します。
     * @param user - Embedのフッターに表示するユーザー
     * @param keywords - 表示するキーワードの配列
     * @returns 生成されたEmbedBuilderの配列
     */
    public createKeywordListEmbeds(user: User, keywords: PrismaKeyword[]): EmbedBuilder[] {
        if (keywords.length === 0) {
            return [this.embedFactory.createBaseEmbed(user).setDescription('このサーバーにはキーワードが登録されていません。')];
        }

        const embeds: EmbedBuilder[] = [];
        let description = '';

        for (const keyword of keywords) {
            const responsesText = Array.isArray(keyword.responses) ? keyword.responses.join(', ') : keyword.responses;

            const fieldText = `**${keyword.trigger}** -> ${responsesText}\n`;

            if (description.length + fieldText.length > this.maxDescriptionLength) {
                const embed = this.embedFactory.createBaseEmbed(user).setTitle('キーワード一覧').setDescription(description);
                embeds.push(embed);
                description = fieldText;
            } else {
                description += fieldText;
            }
        }
        if (description.length > 0) {
            const embed = this.embedFactory.createBaseEmbed(user).setTitle('キーワード一覧').setDescription(description);
            embeds.push(embed);
        }

        return embeds;
    }
}

export default new KeywordEmbed();
