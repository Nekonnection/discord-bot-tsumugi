import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    StringSelectMenuInteraction,
    AutocompleteInteraction,
    PermissionsBitField
} from 'discord.js';
import { AutocompleteCommandInteraction, CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';
import { commandHandler } from '../../..';
import HelpCategoryMenuAction from './HelpCategoryMenuAction';
import HelpOperationMenuAction from './HelpOperationMenuAction';
import { PermissionTranslator } from '../../../utils/PermissionTranslator';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder';
/**
 * Helpコマンド
 */
class HelpCommand extends AutocompleteCommandInteraction {
    readonly command = new CustomSlashCommandBuilder()
        .setName('help')
        .setDescription('Botのヘルプを表示します')
        .setCategory('一般')
        .setUsage('`/help`, `/help ping`')
        .addStringOption((option) =>
            option.setName('command_name').setDescription('指定したコマンドの詳細情報を表示します。').setAutocomplete(true)
        ) as SlashCommandBuilder;
    async onAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption = interaction.options.getFocused(true);
        const choices = focusedOption.name === 'command_name' ? await this.commandsList() : [];
        if (!choices.length) return;

        const filteredChoices = choices.filter((choice) => choice.startsWith(focusedOption.value));
        const response = filteredChoices.map((choice) => ({ name: choice, value: choice }));

        await interaction.respond(response);
    }
    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const optionName = interaction.options.getString('command_name');
        const categoryList = await this.commandsCategoryList();

        await interaction.deferReply();

        const embed = optionName ? await this.createCommandInfoEmbed(interaction, optionName) : await this.createHomeEmbed(interaction, categoryList);

        if (optionName) {
            await interaction.editReply({
                embeds: [embed]
            });
        } else {
            const categoryMenu = await HelpCategoryMenuAction.create();
            const operationMenu = await HelpOperationMenuAction.create();
            const selectMenu = [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenu),
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(operationMenu)
            ];

            await interaction.editReply({
                embeds: [embed],
                components: selectMenu
            });
        }
    }
    /**
     * コマンドの詳細情報の埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @param commandName コマンド名
     * @returns コマンドの詳細情報の埋め込みメッセージ
     */
    private async createCommandInfoEmbed(interaction: ChatInputCommandInteraction, commandName: string): Promise<EmbedBuilder> {
        const commandInfo = commandHandler._commands.find(
            (command) => (command as CommandInteraction).command?.name === commandName
        ) as CommandInteraction;
        const defaultMemberPermissions = commandInfo?.command.default_member_permissions
            ? BigInt(commandInfo.command.default_member_permissions)
            : BigInt(0);
        const defaultBotPermissions = commandInfo?.command.default_bot_permissions ? BigInt(commandInfo.command.default_bot_permissions) : BigInt(0);
        const memberPermissionList = new PermissionTranslator(defaultMemberPermissions).permissionNames.join('\n') || 'なし';
        const botPermissionList = new PermissionTranslator(defaultBotPermissions).permissionNames.join('\n') || 'なし';
        const category = commandInfo?.command?.category || 'なし';
        const usage = commandInfo?.command?.usage || '見つかりませんでした';
        const description = commandInfo?.command?.description || 'なし';
        const memberHasPermissions =
            interaction.member?.permissions instanceof PermissionsBitField && interaction.member.permissions.has(defaultMemberPermissions);

        const botHasPermissions =
            interaction.guild?.members.me?.permissions instanceof PermissionsBitField &&
            interaction.guild.members.me.permissions.has(defaultBotPermissions);

        const hasPermissions = memberHasPermissions && botHasPermissions;
        const permissionStatus = hasPermissions ? 'はい' : 'いいえ';

        return new EmbedBuilder()
            .setAuthor({ name: `猫咲 紬 - コマンド詳細[${commandName}]`, iconURL: config.iconURL })
            .setDescription(description)
            .addFields(
                { name: 'カテゴリー', value: category },
                { name: '使い方', value: usage },
                { name: '実行可能か', value: permissionStatus, inline: true },
                { name: 'ユーザーに必要な権限', value: memberPermissionList, inline: true },
                { name: 'Botに必要な権限', value: botPermissionList, inline: true }
            )
            .setColor(Number(config.botColor))
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined });
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
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined });
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
            const commandList = category.commands.map((command) => ({
                name: `/${command.name}`,
                value: command.description,
                inline: false
            }));
            return new EmbedBuilder()
                .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
                .setColor(Number(config.botColor))
                .addFields(commandList)
                .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined });
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
                if (!command.command) return;
                const category = (command as CommandInteraction).command.category || undefined;
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
    /**
     * コマンドリストを取得する関数
     * @returns コマンドリスト
     */
    private async commandsList(): Promise<string[]> {
        const commands: string[] = [];
        commandHandler._commands.map((command) => {
            if (!command.command) return;
            const category = (command as CommandInteraction).command.category || undefined;
            if (!category) return;

            const commandName = command.command?.name ?? '';

            // コマンドをリストに追加
            commands.push(`${commandName}`);
        });

        return commands;
    }
}

export default new HelpCommand();
