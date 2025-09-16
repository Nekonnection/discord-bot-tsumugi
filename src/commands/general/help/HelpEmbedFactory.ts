import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, StringSelectMenuInteraction } from 'discord.js';

import { CommandInteraction } from '../../../commands/base/command_base.js';
import { CategorizedCommands } from '../../../services/CommandService.js';
import { config } from '../../../utils/config.js';
import { translatePermission } from '../../../utils/permissionTranslator.js';

type HelpInteraction = ChatInputCommandInteraction | StringSelectMenuInteraction;

/**
 * ヘルプ関連のEmbedを生成するファクトリクラス (Singleton)
 */
class HelpEmbedFactory {
    private static instance: HelpEmbedFactory;
    /**
     * シングルトンインスタンスを取得する
     */
    public static getInstance(): HelpEmbedFactory {
        HelpEmbedFactory.instance = new HelpEmbedFactory();
        return HelpEmbedFactory.instance;
    }

    /**
     * ヘルプコマンドのホームEmbedを作成する
     */
    public createHomeEmbed(interaction: HelpInteraction, commandsCategoryList: CategorizedCommands[]): EmbedBuilder {
        const categoryPages =
            commandsCategoryList.length > 0
                ? commandsCategoryList.map((category, index) => `${String(index + 1)}ページ目: ${category.category}`).join('\n')
                : '利用可能なコマンドカテゴリはありません。';

        return this.createBaseEmbed(interaction)
            .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
            .setDescription('コマンドの詳細情報は`/help [コマンド名]`で表示できます。')
            .addFields(
                { name: '各カテゴリー', value: categoryPages },
                {
                    name: 'Botを招待/サポートサーバー',
                    value: `[Botを招待する](${config.inviteURL}) / [サポートサーバーに入る](${config.supportGuildURL})`
                }
            );
    }

    /**
     * コマンドの詳細情報Embedを作成する
     */
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

        const memberHasPermissions = (interaction.member?.permissions as PermissionsBitField).has(memberPerms);
        const botHasPermissions = interaction.guild?.members.me?.permissions.has(botPerms) ?? false;

        const permissionStatus = memberHasPermissions && botHasPermissions ? 'はい' : 'いいえ';
        const memberPermissionList = translatePermission(memberPerms).join('\n') || 'なし';
        const botPermissionList = translatePermission(botPerms).join('\n') || 'なし';

        return this.createBaseEmbed(interaction)
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

        return this.createBaseEmbed(interaction)
            .setAuthor({ name: `猫咲 紬 - ${categoryData.category}`, iconURL: config.iconURL })
            .addFields(commandList);
    }

    /**
     * コマンド利用ガイドのEmbedを作成する
     */
    public createGuideEmbed(interaction: StringSelectMenuInteraction): EmbedBuilder {
        return this.createBaseEmbed(interaction)
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
        return this.createBaseEmbed(interaction).setTitle('エラー').setDescription(message);
    }

    /**
     * Embedの共通フッターなどを設定するベース
     */
    private createBaseEmbed(interaction: HelpInteraction): EmbedBuilder {
        return new EmbedBuilder().setColor(Number(config.botColor)).setFooter({
            text: `実行者: ${interaction.user.displayName}`,
            iconURL: interaction.user.displayAvatarURL() || undefined
        });
    }
}

export default HelpEmbedFactory.getInstance();
