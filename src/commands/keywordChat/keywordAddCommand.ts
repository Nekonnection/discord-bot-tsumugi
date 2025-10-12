import { ChatInputCommandInteraction, ModalBuilder, PermissionsBitField } from 'discord.js';

import CustomSlashSubcommandBuilder from '../../utils/CustomSlashSubCommandBuilder.js';
import { CommandGroupInteraction, SubCommandInteraction } from '../base/command_base.js';
import keywordAddModal from './action/KeywordAddModal.js';
import keywordCommandGroup from './KeywordCommandGroup.js';
/**
 * キーワード登録/更新コマンド
 */
class KeywordAddCommand extends SubCommandInteraction {
    public command: CustomSlashSubcommandBuilder = new CustomSlashSubcommandBuilder()
        .setName('add')
        .setDescription('キーワードを登録/更新します。')
        .setCategory('キーワード応答機能')
        .setUsage('`/keyword add`')
        .setDefaultBotPermissions(PermissionsBitField.Flags.ManageGuild);

    public constructor() {
        super(keywordCommandGroup as CommandGroupInteraction);
    }

    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const modal: ModalBuilder = keywordAddModal.create();
        await interaction.showModal(modal);
    }
}

export default new KeywordAddCommand();
