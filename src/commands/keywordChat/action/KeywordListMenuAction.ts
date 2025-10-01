import { ComponentType, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';

import { prisma } from '../../../index.js';
import { MessageComponentActionInteraction } from '../../base/action_base.js';
import keywordEmbed from '../keywordEmbed.js';

/**
 * キーワード一覧のページネーションメニューの作成と処理を行う
 */
class KeywordListMenuAction extends MessageComponentActionInteraction<ComponentType.StringSelect> {
    public constructor() {
        super('keyword_list_page', ComponentType.StringSelect);
    }

    /**
     * ページネーション用のセレクトメニュービルダーを作成します
     * @param totalPages - 総ページ数
     * @returns 作成したビルダー
     */
    public override async create(totalPages: number): Promise<StringSelectMenuBuilder> {
        const customId = this.createCustomId();

        const pageOptions = Array.from({ length: totalPages }, (_, i) => ({
            label: `${String(i + 1)}ページ目を表示`,
            value: String(i)
        }));

        const menu = new StringSelectMenuBuilder().setCustomId(customId).setPlaceholder('ページを選択').addOptions(pageOptions);
        return Promise.resolve(menu);
    }

    /**
     * メニューが選択された際の処理
     * @param interaction - 受信したインタラクション
     */
    protected override async onCommand(interaction: StringSelectMenuInteraction): Promise<void> {
        const selectedPageIndex = parseInt(interaction.values[0], 10);
        const channelId = interaction.channel?.id;
        if (!channelId) {
            await interaction.reply({ content: 'チャンネル情報が取得できませんでした。', flags: MessageFlags.Ephemeral });
            return;
        }

        const prismaKeywordsRaw = await prisma.keyword.findMany({
            where: { channelId: channelId },
            orderBy: { trigger: 'asc' }
        });

        const prismaKeywords = prismaKeywordsRaw.map((k) => ({
            ...k,
            responses:
                k.responses === null
                    ? []
                    : Array.isArray(k.responses)
                      ? k.responses.filter((v): v is string => typeof v === 'string')
                      : typeof k.responses === 'string'
                        ? k.responses
                        : []
        }));

        const embeds = keywordEmbed.createPaginatedTriggerListEmbeds(interaction.user, prismaKeywords);

        const targetEmbed = embeds[selectedPageIndex];
        if (selectedPageIndex < 0 || selectedPageIndex >= embeds.length) {
            await interaction.update({ content: '指定されたページの表示に失敗しました。', embeds: [], components: [] });
            return;
        }

        await interaction.update({ embeds: [targetEmbed] });
    }
}

export default new KeywordListMenuAction();
