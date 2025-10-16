import { ActionRowBuilder, ChatInputCommandInteraction, StringSelectMenuBuilder } from 'discord.js';

import { prisma } from '../../index.js';
import CustomSlashSubcommandBuilder from '../../utils/CustomSlashSubCommandBuilder.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordListMenuAction from './action/KeywordListMenuAction.js';
import keywordCommandGroup from './KeywordCommandGroup.js';
import keywordEmbed from './KeywordEmbed.js';
/**
 * キーワード一覧表示コマンド
 */
class KeywordListCommand extends SubCommandInteraction {
    public command = new CustomSlashSubcommandBuilder()
        .setName('list')
        .setDescription('登録されているキーワードの一覧、または指定したキーワードの応答を表示します。')
        .setCategory('キーワード応答機能')
        .setUsage('`/keyword list`\n`/keyword list keyword: <キーワード名>`')
        .addStringOption((option) =>
            option.setName('keyword').setDescription('応答を表示するキーワードを指定します。').setRequired(false)
        ) as CustomSlashSubcommandBuilder;

    public constructor() {
        super(keywordCommandGroup);
    }

    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const triggerKeyword = interaction.options.getString('keyword');

        if (triggerKeyword) {
            await this.showResponses(interaction, triggerKeyword);
        } else {
            await this.showList(interaction);
        }
    }

    /**
     * 登録されているキーワードの一覧を表示する
     * 複数ページになる場合はページネーションメニューを付ける
     */
    private async showList(interaction: ChatInputCommandInteraction): Promise<void> {
        const channelId = interaction.channel?.id;

        const prismaKeywords = await prisma.keyword.findMany({
            where: { channelId: channelId },
            orderBy: { trigger: 'asc' }
        });

        if (prismaKeywords.length === 0) {
            await interaction.editReply('このチャンネルには登録されているキーワードがありません。');
            return;
        }
        // ページ分割されたEmbedの配列を生成
        const typedKeywords = prismaKeywords.map((k) => ({
            ...k,
            responses: Array.isArray(k.responses)
                ? k.responses.filter((r): r is string => typeof r === 'string')
                : typeof k.responses === 'string'
                  ? [k.responses]
                  : []
        }));
        const embeds = keywordEmbed.createPaginatedTriggerListEmbeds(interaction.user, typedKeywords);
        const firstEmbed = embeds[0];

        if (embeds.length <= 1) {
            await interaction.editReply({ embeds: [firstEmbed], components: [] });
            return;
        }

        const menu = await keywordListMenuAction.create(embeds.length);
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

        await interaction.editReply({
            embeds: [firstEmbed],
            components: [row]
        });
    }

    /**
     * 指定されたキーワードの応答メッセージを表示します。
     */
    private async showResponses(interaction: ChatInputCommandInteraction, trigger: string): Promise<void> {
        const keyword = await prisma.keyword.findFirst({
            where: {
                channelId: interaction.channel?.id,
                trigger: trigger
            }
        });

        if (!keyword) {
            await interaction.editReply(`キーワード「${trigger}」は見つかりませんでした。`);
            return;
        }

        const typedKeyword = {
            ...keyword,
            responses: Array.isArray(keyword.responses)
                ? keyword.responses.filter((r): r is string => typeof r === 'string')
                : typeof keyword.responses === 'string'
                  ? [keyword.responses]
                  : []
        };
        const embed = keywordEmbed.createKeywordResponsesEmbed(interaction.user, typedKeyword);
        await interaction.editReply({ embeds: [embed] });
    }
}

export default new KeywordListCommand();
