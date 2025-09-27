import { ActionRowBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';

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
            .setMinLength(1)
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const responsesInput = new TextInputBuilder()
            .setCustomId('responses')
            .setLabel('応答メッセージ (改行で複数指定)')
            .setPlaceholder('例:\nやあ！\nどうも！')
            .setMinLength(1)
            .setMaxLength(1000)
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
        const responses = responsesRaw.split('\n').filter((line) => line.trim() !== '');

        const mentionPattern = /<@!?&?(\d{17,20})>/g;
        if (responses.some((res) => mentionPattern.test(res) || res.includes('@everyone') || res.includes('@here'))) {
            await interaction.reply({
                content: '応答メッセージにメンションを含めることはできません。',
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const forbiddenPatterns = [/[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27}/i, /mfa\.[a-z0-9_-]{20,}/i];
        const hasForbiddenPattern = responses.some((response) => forbiddenPatterns.some((pattern) => pattern.test(response)));

        if (hasForbiddenPattern) {
            await interaction.reply({
                content: '応答メッセージに、機密情報と疑われる形式の文字列が含まれているため登録できません。',
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        try {
            const channelId = interaction.channel?.id;
            if (!channelId) {
                await interaction.reply({ content: 'チャンネル情報が取得できませんでした。', flags: MessageFlags.Ephemeral });
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
                content: `キーワード「${trigger}」を登録しました。`,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            logger.error(error);
            await interaction.reply({
                content: 'キーワードの登録中にエラーが発生しました。',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

export default new KeywordAddModal();
