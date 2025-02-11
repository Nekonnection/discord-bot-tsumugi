import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    StringSelectMenuInteraction
} from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
import { commandHandler } from '../../..';
import HelpCategoryMenuAction from './HelpCategoryMenuAction';
import HelpOperationMenuAction from './HelpOperationMenuAction';
/**
 * Helpコマンド
 */
class HelpCommands extends CommandInteraction {
    category = '一般';
    command = new SlashCommandBuilder().setName('help').setDescription('Botのヘルプを表示します');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const embeds = await this.createHomeEmbed(interaction, await this.commandsCategoryList());
        const categoryMenu = await HelpCategoryMenuAction.create();
        const operationMenu = await HelpOperationMenuAction.create();
        const selectMenu = [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenu),
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(operationMenu)
        ];
        await interaction.editReply({
            embeds: [embeds],
            components: [...selectMenu]
        });
    }
    /**
     * ホームの埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @param commandsCategoryList コマンドカテゴリーリスト
     * @returns ホームの埋め込みメッセージ
     */
    public async createHomeEmbed(
        interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
        commandsCategoryList: { category: string; commands: { name: string; description: string }[] }[]
    ): Promise<EmbedBuilder> {
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
    public async createCategoryEmbeds(
        interaction: StringSelectMenuInteraction,
        commandsCategoryList: { category: string; commands: { name: string; description: string }[] }[]
    ): Promise<EmbedBuilder[]> {
        return commandsCategoryList.map((category) => {
            return new EmbedBuilder()
                .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
                .setDescription(`${category.category}コマンド一覧`)
                .setColor(Number(config.botColor))
                .addFields(
                    category.commands.map((command) => ({
                        name: `/${command.name}`,
                        value: command.description,
                        inline: false
                    }))
                )
                .setTimestamp()
                .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() || undefined });
        });
    }
    /**
     * コマンドをカテゴリーごとに分類する関数
     * @returns コマンドをカテゴリーごとに分類したリスト
     */
    public async commandsCategoryList(): Promise<{ category: string; commands: { name: string; description: string }[] }[]> {
        const commandsCategory: { [category: string]: { name: string; description: string }[] } = {};

        // コマンドをカテゴリーごとに分類
        await Promise.all(
            commandHandler._commands.map(async (command) => {
                const category = (command as CommandInteraction).category || undefined;
                // カテゴリーがない場合は無視(コマンド処理以外のクラス)
                if (!category) return;
                if (!commandsCategory[category]) {
                    commandsCategory[category] = [];
                }
                commandsCategory[category].push({
                    name: command.command?.name ?? '',
                    description: command.command?.description ?? ''
                });
            })
        );

        // カテゴリーごとに分類したコマンドリストを作成
        return Object.entries(commandsCategory).map(([category, commands]) => ({
            category,
            commands
        }));
    }
}

export default new HelpCommands();
