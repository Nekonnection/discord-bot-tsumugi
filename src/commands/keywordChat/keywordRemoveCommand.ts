import { ChatInputCommandInteraction } from 'discord.js';

import { prisma } from '../../index.js';
import CustomSlashSubcommandBuilder from '../../utils/CustomSlashSubCommandBuilder.js';
import { logger } from '../../utils/log.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordCommandGroup from './keywordCommandGroup.js';

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
        if (!interaction.guild) {
            await interaction.reply({ content: 'サーバー内でのみ実行できます。', ephemeral: true });
            return;
        }
        const trigger = interaction.options.getString('keyword', true);

        try {
            const channelId = interaction.channel?.id;
            if (!channelId) {
                await interaction.reply({ content: 'チャンネル情報が取得できませんでした。', ephemeral: true });
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
            await interaction.reply({ content: `キーワード「${trigger}」を削除しました。`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `キーワード「${trigger}」は見つかりませんでした。`, ephemeral: true });
            logger.error('キーワード削除エラー: ', error);
        }
    }
}

export default new KeywordRemoveCommand();
