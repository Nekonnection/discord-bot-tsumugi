import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';

import { prisma } from '../../../index.js';
import { logger } from '../../../utils/log.js';
import { ModalActionInteraction } from '../../base/action_base.js';

class KeywordAddModal extends ModalActionInteraction {
    public constructor() {
        super('keyword_add_modal');
    }
    /** @inheritdoc */
    public create(): ModalBuilder {
        const keywordInput = new TextInputBuilder()
            .setCustomId('trigger')
            .setLabel('キーワード')
            .setPlaceholder('例: こんにちは')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const responsesInput = new TextInputBuilder()
            .setCustomId('responses')
            .setLabel('応答メッセージ (改行で複数指定)')
            .setPlaceholder('例:\nやあ！\nどうも！')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        return new ModalBuilder()
            .setCustomId(this.createCustomId())
            .setTitle('キーワードの新規登録')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(keywordInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(responsesInput)
            );
    }

    /** @inheritdoc */
    protected async onCommand(interaction: ModalSubmitInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({ content: 'サーバー内でのみ実行できます。' });
            return;
        }

        const trigger = interaction.fields.getTextInputValue('trigger');
        const responsesRaw = interaction.fields.getTextInputValue('responses');
        if (responsesRaw.includes('@')) {
            await interaction.reply({ content: '応答メッセージに`@`を含めることはできません。' });
            return;
        }
        const responses = responsesRaw.split('\n').filter((line) => line.trim() !== '');

        const forbiddenPatterns = [/[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27}/i, /mfa\.[a-z0-9_-]{20,}/i];

        const hasForbiddenPattern = responses.some((response) => forbiddenPatterns.some((pattern) => pattern.test(response)));

        if (hasForbiddenPattern) {
            await interaction.reply({
                content: '応答メッセージに、機密情報（Discordトークンなど）と疑われる形式の文字列が含まれているため登録できません。'
            });
            return;
        }

        if (responses.length === 0) {
            await interaction.reply({ content: '応答メッセージを1つ以上入力してください。' });
            return;
        }

        try {
            const channelId = interaction.channel?.id;
            if (!channelId) {
                await interaction.reply({ content: 'チャンネル情報が取得できませんでした。' });
                return;
            }
            await prisma.channel.upsert({
                where: { id: channelId },
                update: {},
                create: { id: channelId }
            });
            await prisma.keyword.upsert({
                where: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    channelId_trigger: {
                        channelId: channelId,
                        trigger: trigger
                    }
                },
                update: {
                    responses: responses
                },
                create: {
                    channelId: channelId,
                    trigger: trigger,
                    responses: responses
                }
            });

            await interaction.reply({
                content: `キーワード「${trigger}」を登録しました。`
            });
        } catch (error) {
            logger.error(error);
            await interaction.reply({
                content: 'キーワードの登録中にエラーが発生しました。'
            });
        }
    }
}

export default new KeywordAddModal();
