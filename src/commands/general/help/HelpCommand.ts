import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
import { commandHandler } from '../../..';

/**
 * Helpコマンド
 */
class HelpCommands extends CommandInteraction {
    category = '一般';
    command = new SlashCommandBuilder().setName('help').setDescription('Botのヘルプを表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const embeds = this.createEmbeds(interaction);
        const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            this.createSelectMenu()
        );
        await interaction.reply({ 
            embeds: [embeds[0]],
            components: [selectMenu]
        });
    }
    /**
     * 埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @returns ヘルプコマンド全ての埋め込みメッセージ
     */
    private createEmbeds(interaction: ChatInputCommandInteraction): EmbedBuilder[] {
        const commandsCategoryList = this.commandsCategoryList();
        const homeEmbed = this.createHomeEmbed(interaction, commandsCategoryList);
        const categoryEmbeds = this.createCategoryEmbeds(interaction, commandsCategoryList);

        return [homeEmbed, ...categoryEmbeds];
    }
    /**
     * ホームの埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @param commandsCategoryList コマンドカテゴリーリスト
     * @returns ホームの埋め込みメッセージ
     */
    private createHomeEmbed(
        interaction: ChatInputCommandInteraction,
        commandsCategoryList: { category: string; commands: { name: string; description: string }[] }[]
    ): EmbedBuilder {
        const categoryPages = commandsCategoryList.map((category, index) => `${index + 1}ページ目: ${category.category}`).join('\n');

        return new EmbedBuilder()
            .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
            .setDescription('コマンドの詳細情報は`/help [コマンド名]`で表示できます。')
            .addFields({ name: '各カテゴリー', value: categoryPages })
            .addFields({
                name: 'Botを招待/サポートサーバー',
                value: `[Botを招待する](${config.inviteURL})/[サポートサーバーに入る](${config.supportGuildURL})`
            })
            .setColor(Number(config.botColor))
            .setTimestamp()
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() || undefined });
    }
    /**
     * カテゴリーごとの埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @param commandsCategoryList コマンドカテゴリーリスト
     * @returns カテゴリーごとの埋め込みメッセージ
     */
    private createCategoryEmbeds(
        interaction: ChatInputCommandInteraction,
        commandsCategoryList: { category: string; commands: { name: string; description: string }[] }[]
    ): EmbedBuilder[] {
        return commandsCategoryList.map((category) => {
            return new EmbedBuilder()
                .setAuthor({ name: "猫咲 紬 - ヘルプ", iconURL: config.iconURL })
                .setTitle(`${category.category}`)
                .setColor(Number(config.botColor))
                .setDescription(category.commands.map((command) => `**/${command.name}**: ${command.description}`).join('\n'))
                .setTimestamp()
                .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() || undefined });
        });
    }
    /**
     * カテゴリーごとのページ選択メニューを作成する関数
     * @returns ページ選択メニュー
     */
    private createSelectMenu(): StringSelectMenuBuilder {
        const commandsCategoryList = this.commandsCategoryList();
        const categoryPages = commandsCategoryList.map((category, index) => `${index + 1}ページ目: ${category.category}`).join('\n');
        const categoryOptions = commandsCategoryList.map((category) => ({
            label: categoryPages,
            description: `${category.category}に関するコマンド一覧`,
            value: category.category
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("help_category_select")
            .setPlaceholder("ページを選択してください")
            .addOptions(categoryOptions);

        return selectMenu;
    }
    /**
     * コマンドをカテゴリーごとに分類する関数
     * @returns コマンドをカテゴリーごとに分類したリスト
     */
    private commandsCategoryList(): { category: string; commands: { name: string; description: string }[] }[] {
        const commandsCategory: { [category: string]: { name: string; description: string }[] } = {};

        // コマンドをカテゴリーごとに分類
        commandHandler._commands.forEach((command) => {
            const category = (command as CommandInteraction).category || "その他";
            if (!commandsCategory[category]) {
                commandsCategory[category] = [];
            }
            commandsCategory[category].push({
                name: command.command?.name ?? "コマンド名が見つかりませんでした",
                description: command.command?.description ?? "コマンド説明が見つかりませんでした"
            });
        });

        // カテゴリーごとに分類したコマンドリストを作成
        return Object.entries(commandsCategory).map(([category, commands]) => ({
            category,
            commands
        }));
    }
}

export default new HelpCommands();
