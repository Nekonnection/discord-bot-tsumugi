import { ComponentType, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';
import { MessageComponentActionInteraction } from '../../base/action_base';
import helpCommand from './HelpCommand';

class HelpCategoryMenuAction extends MessageComponentActionInteraction<ComponentType.StringSelect> {
    /**
     * セレクトメニューを作成
     * @returns 作成したビルダー
     */
    override async create(): Promise<StringSelectMenuBuilder> {
        const customId = this.createCustomId();
        const commandsCategoryList = await helpCommand.commandsCategoryList();
        const categoryOptions = commandsCategoryList.map((category, index) => ({
            label: `${index + 1}ページ目: ${category.category}`,
            description: `カテゴリー: ${category.category}コマンド に移動します`,
            value: category.category
        }));
        return new StringSelectMenuBuilder().setCustomId(customId).setPlaceholder('ページを選択').addOptions(categoryOptions);
    }

    /**
     * コマンドが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    async onCommand(interaction: StringSelectMenuInteraction): Promise<void> {
        const commandsCategoryList = await helpCommand.commandsCategoryList(); 
        const category = interaction.values[0];

        const categoryIndex = commandsCategoryList.findIndex((cat) => cat.category === category);
        if (categoryIndex === -1) return;

        const categoryEmbeds = await helpCommand.createCategoryEmbeds(interaction, commandsCategoryList);
        const categoryEmbed = categoryEmbeds[categoryIndex];
        
        await interaction.update({
            embeds: [categoryEmbed]
        });
    }
}

export default new HelpCategoryMenuAction('help_category', ComponentType.StringSelect);
