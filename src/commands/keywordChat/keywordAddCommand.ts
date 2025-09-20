import { ChatInputCommandInteraction, ModalBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

import { CommandGroupInteraction, SubCommandInteraction } from '../base/command_base.js';
import keywordAddModal from './action/keywordAddModal.js';
import keywordCommandGroup from './keywordCommandGroup.js';

class KeywordAddCommand extends SubCommandInteraction {
    public command: SlashCommandSubcommandBuilder = new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('新しいキーワードを登録します。');

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
