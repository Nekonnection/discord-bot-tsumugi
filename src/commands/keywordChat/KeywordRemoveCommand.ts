import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';

import { prisma } from '../../index.js';
import CustomSlashSubcommandBuilder from '../../utils/CustomSlashSubCommandBuilder.js';
import { logger } from '../../utils/log.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordCommandGroup from './KeywordCommandGroup.js';

/**
 * キーワード削除コマンド
 */
class KeywordRemoveCommand extends SubCommandInteraction {
    public command = new CustomSlashSubcommandBuilder()
        .setName('remove')
        .setDescription('登録されているキーワードを削除します。')
        .setCategory('キーワード応答機能')
        .setUsage('`/keyword remove <キーワード>`')
        .addStringOption((option) =>
            option.setName('keyword').setDescription('削除するキーワードを指定します。').setRequired(true)
        ) as CustomSlashSubcommandBuilder;

    public constructor() {
        super(keywordCommandGroup);
    }

    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const trigger = interaction.options.getString('keyword', true);

        try {
            const channelId = interaction.channel?.id;
            if (!channelId) {
                await interaction.reply({ content: 'チャンネル情報が取得できませんでした。', flags: MessageFlags.Ephemeral });
                return;
            }
            await prisma.keyword.delete({
                where: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    channelId_trigger: {
                        channelId: channelId,
                        trigger: trigger
                    }
                }
            });
            await interaction.reply({ content: `キーワード「${trigger}」を削除しました。`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await interaction.reply({ content: `キーワード「${trigger}」は見つかりませんでした。`, flags: MessageFlags.Ephemeral });
            logger.error('キーワード削除処理中にエラーが発生', error);
        }
    }
}

export default new KeywordRemoveCommand();
