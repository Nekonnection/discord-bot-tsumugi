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
            await interaction.reply({ content: 'サーバー内でのみ実行できます。', ephemeral: true });
            return;
        }

        const trigger = interaction.fields.getTextInputValue('trigger');
        const responsesRaw = interaction.fields.getTextInputValue('responses');

        // 改行で分割し、空行を除外して配列にする
        const responses = responsesRaw.split('\n').filter((line) => line.trim() !== '');

        if (responses.length === 0) {
            await interaction.reply({ content: '応答メッセージを1つ以上入力してください。', ephemeral: true });
            return;
        }

        try {
            // データベースにキーワードを登録 (存在すれば更新、なければ作成)
            await prisma.guild.upsert({
                where: { id: interaction.guild.id },
                update: {},
                create: { id: interaction.guild.id }
            });
            await prisma.keyword.upsert({
                where: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    guildId_trigger: {
                        guildId: interaction.guild.id,
                        trigger: trigger
                    }
                },
                update: {
                    responses: responses
                },
                create: {
                    guildId: interaction.guild.id,
                    trigger: trigger,
                    responses: responses
                }
            });

            await interaction.reply({
                content: `キーワード「${trigger}」を登録しました。`,
                ephemeral: true
            });
        } catch (error) {
            logger.error(error);
            await interaction.reply({
                content: 'キーワードの登録中にエラーが発生しました。',
                ephemeral: true
            });
        }
    }
}

export default new KeywordAddModal();
