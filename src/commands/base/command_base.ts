import {
    ApplicationCommandDataResolvable,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Interaction,
    MessageFlags,
    PermissionResolvable,
    PermissionsBitField,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { InteractionBase } from './interaction_base';
import CustomSlashCommandBuilder from '../../utils/CustomSlashCommandBuilder';
/**
 * コマンドベースのインタラクション
 */
interface CommandBasedInteraction {
    /**
     * 自分のインタラクションかどうかを判定するための関数
     * @param interaction インタラクション
     * @returns 自分のインタラクションかどうか
     */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean;
}

/**
 * コマンドグループ
 */
export abstract class CommandGroupInteraction extends InteractionBase implements CommandBasedInteraction {
    abstract command: SlashCommandSubcommandsOnlyBuilder;

    /** @inheritdoc */
    override registerCommands(commandList: ApplicationCommandDataResolvable[]): void {
        commandList.push(this.command);
    }

    /** @inheritdoc */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean {
        return interaction.commandName === this.command.name;
    }
}
/**
 * サブコマンドグループ
 */
export abstract class SubcommandGroupInteraction extends InteractionBase implements CommandBasedInteraction {
    abstract command: SlashCommandSubcommandGroupBuilder;

    /**
     * コンストラクタ
     * @param _registry サブコマンドグループを登録する先
     */
    constructor(private _registry: CommandGroupInteraction) {
        super();
    }

    /** @inheritdoc */
    override registerSubCommands(): void {
        this._registry.command.addSubcommandGroup(this.command);
    }

    /** @inheritdoc */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean {
        return interaction.options.getSubcommandGroup() === this.command.name && this._registry.isMyInteraction(interaction);
    }
}
/**
 * コマンド
 */
export abstract class CommandInteraction extends InteractionBase implements CommandBasedInteraction {
    abstract command: CustomSlashCommandBuilder;

    /** @inheritdoc */
    override registerCommands(commandList: ApplicationCommandDataResolvable[]): void {
        commandList.push(this.command);
    }

    /** @inheritdoc */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean {
        return interaction.commandName === this.command.name;
    }

    /** @inheritdoc */
    override async onInteractionCreate(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand() || !this.isMyInteraction(interaction)) return;

        const permissionChecker = new PermissionChecker(this.command);

        if (!(await permissionChecker.checkPermissions(interaction))) return;

        await this.onCommand(interaction);
    }

    /**
     * コマンドが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    abstract onCommand(interaction: ChatInputCommandInteraction): Promise<void>;
}

/**
 * サブコマンド
 */
export abstract class SubCommandInteraction extends InteractionBase implements CommandBasedInteraction {
    abstract command: SlashCommandSubcommandBuilder;

    /**
     * コンストラクタ
     * @param _registry サブコマンドグループを登録する先
     */
    constructor(private _registry: CommandGroupInteraction | SubcommandGroupInteraction) {
        super();
    }

    /** @inheritdoc */
    override registerSubCommands(): void {
        this._registry.command.addSubcommand(this.command);
    }

    /** @inheritdoc */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean {
        return interaction.options.getSubcommand() === this.command.name && this._registry.isMyInteraction(interaction);
    }

    /** @inheritdoc */
    override async onInteractionCreate(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand()) return;
        if (!this.isMyInteraction(interaction)) return;
        await this.onCommand(interaction);
    }

    /**
     * コマンドが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    abstract onCommand(interaction: ChatInputCommandInteraction): Promise<void>;
}
/**
 * オートコンプリート付きコマンド
 */
export abstract class AutocompleteCommandInteraction extends InteractionBase implements CommandBasedInteraction {
    abstract command: CustomSlashCommandBuilder;

    /** @inheritdoc */
    override registerCommands(commandList: ApplicationCommandDataResolvable[]): void {
        commandList.push(this.command);
    }

    /** @inheritdoc */
    isMyInteraction(interaction: ChatInputCommandInteraction): boolean {
        return interaction.commandName === this.command.name;
    }

    /** @inheritdoc */
    override async onInteractionCreate(interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand() && this.isMyInteraction(interaction)) {
            const permissionChecker = new PermissionChecker(this.command);

            if (!(await permissionChecker.checkPermissions(interaction))) return;
            await this.onCommand(interaction);
        } else if (interaction.isAutocomplete()) {
            await this.onAutocomplete(interaction);
        }
    }

    /**
     * コマンドが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    abstract onCommand(interaction: ChatInputCommandInteraction): Promise<void>;
    /**
     * オートコンプリートが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    abstract onAutocomplete(interaction: AutocompleteInteraction): Promise<void>;
}
/**
 * 権限を確認するクラス
 */
export class PermissionChecker {
    private command: CustomSlashCommandBuilder;

    constructor(command: CustomSlashCommandBuilder) {
        this.command = command;
    }
    /**
     * Botとメンバーの権限を確認します。
     * @param interaction インタラクション
     * @returns 権限が満たされている場合はtrue、そうでない場合はfalse
     */
    async checkPermissions(interaction: ChatInputCommandInteraction): Promise<boolean> {
        const botPermissions = interaction.guild?.members.me?.permissions;
        const requiredBotPerms = this.command.default_bot_permissions;

        if (requiredBotPerms && botPermissions) {
            const requiredPermsField = new PermissionsBitField(requiredBotPerms as PermissionResolvable);
            if (!botPermissions.has(requiredPermsField)) {
                const missingPerms = requiredPermsField
                    .toArray()
                    .filter(p => !botPermissions.has(p));
                
                await interaction.reply({
                    content: `Botに必要な権限が不足しています。\n不足している権限: \`${missingPerms.join(', ')}\``,
                    flags: MessageFlags.Ephemeral
                });
                return false;
            }
        }

        // メンバーの権限をチェック
        const memberPermissions = interaction.member?.permissions;
        const requiredMemberPerms = this.command.default_member_permissions;

        if (requiredMemberPerms && memberPermissions instanceof PermissionsBitField) {
            const requiredPermsField = new PermissionsBitField(requiredMemberPerms as PermissionResolvable);
            if (!memberPermissions.has(requiredPermsField)) {
                 const missingPerms = requiredPermsField
                    .toArray()
                    .filter(p => !memberPermissions.has(p));

                await interaction.reply({
                    content: `コマンドの実行に必要な権限が不足しています。\n不足している権限: \`${missingPerms.join(', ')}\``,
                    flags: MessageFlags.Ephemeral
                });
                return false;
            }
        }

        return true;
    }
}
