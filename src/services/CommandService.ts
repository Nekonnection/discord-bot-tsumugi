import { CommandGroupInteraction, CommandInteraction, SubCommandInteraction } from '../commands/base/command_base.js';
import { InteractionBase } from '../commands/base/interaction_base.js';
import CommandHandler from '../commands/CommandHandler.js';

export interface CommandInfo {
    name: string;
    description: string;
}

export interface CategorizedCommands {
    category: string;
    commands: CommandInfo[];
}

export interface CommandHelpInfo {
    name: string;
    description: string;
    category: string;
    usage: string;
    defaultMemberPermissions: bigint;
    defaultBotPermissions: bigint;
}

class CommandService {
    private interactions: InteractionBase[] = [];

    private commands: (CommandInteraction | SubCommandInteraction)[] = [];

    public initialize(commandHandler: CommandHandler): void {
        this.interactions = commandHandler._commands;

        this.commands = this.interactions.filter(
            (c): c is CommandInteraction | SubCommandInteraction =>
                (c instanceof CommandInteraction || c instanceof SubCommandInteraction) &&
                'category' in c.command &&
                typeof c.command.category === 'string'
        );
    }

    /**
     * interactionインスタンスからフルネームを取得するヘルパーメソッド
     */
    private getCommandFullName(interaction: CommandInteraction | SubCommandInteraction): string {
        if (interaction instanceof SubCommandInteraction) {
            const parent = interaction.registry;
            if (parent instanceof CommandGroupInteraction) {
                return `${parent.command.name} ${interaction.command.name}`;
            }
        }
        return interaction.command.name;
    }

    /**
     * 指定された名前のコマンド情報を取得する（フルネーム検索に対応）
     * @param name コマンドのフルネーム
     * @returns コマンド情報
     */
    public findCommandName(name: string): CommandInteraction | SubCommandInteraction | undefined {
        return this.commands.find((c) => this.getCommandFullName(c) === name);
    }

    /**
     * オートコンプリート用のコマンド名リストを取得する（フルネームを返すように修正）
     * @returns コマンド名の配列
     */
    public getCommandNames(): string[] {
        return this.commands.map((c) => this.getCommandFullName(c));
    }

    /**
     * コマンドをカテゴリーごとに分類して取得する
     * @returns カテゴリーごとのコマンドリスト
     */
    public getCommandsCategory(): CategorizedCommands[] {
        const commandsCategory: Record<string, CommandInfo[]> = {};

        for (const cmd of this.commands) {
            if ('category' in cmd.command && typeof cmd.command.category === 'string') {
                const category = cmd.command.category;

                if (!(category in commandsCategory)) {
                    commandsCategory[category] = [];
                }

                commandsCategory[category].push({
                    name: this.getCommandFullName(cmd), // ヘルパーメソッドを使用
                    description: cmd.command.description
                });
            }
        }

        return Object.entries(commandsCategory).map(([category, commands]) => ({
            category,
            commands
        }));
    }
}

export default new CommandService();
