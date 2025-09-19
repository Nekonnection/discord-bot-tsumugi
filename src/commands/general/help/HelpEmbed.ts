import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { CategorizedCommands } from '../../../services/CommandService.js';
import { config } from '../../../utils/config.js';
import { translatePermission } from '../../../utils/permissionTranslator.js';
import { CommandInteraction } from '../../base/command_base.js';

type HelpInteraction = ChatInputCommandInteraction | StringSelectMenuInteraction;

/**
 * ヘルプコマンドに関連するEmbedを生成するクラス
 */
export class HelpEmbed {
    private readonly embedFactory = new EmbedFactory();

    public createHomeEmbed(interaction: HelpInteraction, commandsCategoryList: CategorizedCommands[]): EmbedBuilder {
        const categoryPages =
            commandsCategoryList.length > 0
                ? commandsCategoryList.map((category, index) => `${String(index + 1)}ページ目: ${category.category}`).join('\n')
                : '利用可能なコマンドカテゴリはありません。';

        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
            .setDescription('コマンドの詳細は`/help [コマンド名]`で表示できます。')
            .addFields(
                { name: '各カテゴリー', value: categoryPages },
                {
                    name: 'Botを招待/サポートサーバー',
                    value: `[Botを招待する](${config.inviteURL}) / [サポートサーバーに入る](${config.supportGuildURL})`
                }
            );
    }

    public createCommandInfoEmbed(interaction: ChatInputCommandInteraction, commandInfo: CommandInteraction): EmbedBuilder {
        const {
            name,
            description = '説明がありません',
            category = '未分類',
            usage = '使用方法が設定されていません',
            default_member_permissions: defaultMemberPermissions,
            defaultBotPermissions
        } = commandInfo.command;

        const memberPerms = BigInt(defaultMemberPermissions ?? 0);
        const botPerms = BigInt(defaultBotPermissions ?? 0);

        const memberHasPermissions = interaction.memberPermissions?.has(memberPerms) ?? false;
        const botHasPermissions = interaction.guild?.members.me?.permissions.has(botPerms) ?? false;

        const permissionStatus = memberHasPermissions && botHasPermissions ? 'はい' : 'いいえ';
        const memberPermissionList = translatePermission(memberPerms).join('\n') || 'なし';
        const botPermissionList = translatePermission(botPerms).join('\n') || 'なし';

        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setAuthor({ name: `猫咲 紬 - コマンド詳細 [${name}]`, iconURL: config.iconURL })
            .setDescription(description)
            .addFields(
                { name: 'カテゴリー', value: category },
                { name: '使い方', value: usage },
                { name: '実行可能か', value: permissionStatus, inline: true },
                { name: 'ユーザーに必要な権限', value: memberPermissionList, inline: true },
                { name: 'Botに必要な権限', value: botPermissionList, inline: true }
            );
    }
    /**
     * カテゴリごとのコマンドリストEmbedを作成する
     */
    public createCategoryEmbed(interaction: StringSelectMenuInteraction, categoryData: CategorizedCommands): EmbedBuilder {
        const commandList = categoryData.commands.map((command) => ({
            name: `/${command.name}`,
            value: command.description,
            inline: false
        }));

        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setAuthor({ name: `猫咲 紬 - ${categoryData.category}`, iconURL: config.iconURL })
            .addFields(commandList);
    }
    /**
     * コマンドガイドのEmbedを作成する
     */
    public createGuideEmbed(interaction: StringSelectMenuInteraction): EmbedBuilder {
        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setAuthor({ name: '猫咲 紬 - コマンドガイド', iconURL: config.iconURL })
            .setDescription('現在、スラッシュコマンドに移行中です。\n今後の更新でプレフィックスコマンドはサポートされなくなります。')
            .setFields({
                name: 'コマンドの使用方法',
                value: '`/[コマンド名]`で使用できます。\n例: `/ping`\n以前のプレフィックスコマンドを使用する場合、`t#help`を使用して確認してください。'
            })
            .setTimestamp();
    }
    /**
     * エラーEmbedを作成する
     */
    public createErrorEmbed(interaction: HelpInteraction, message: string): EmbedBuilder {
        return this.embedFactory.createErrorEmbed(interaction.user, message);
    }
}

export default new HelpEmbed();
