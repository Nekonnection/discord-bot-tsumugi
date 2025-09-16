import { CommandInteraction } from '../commands/base/command_base.js';
import CommandHandler from '../commands/CommandHandler.js';

export interface CommandInfo {
    name: string;
    description: string;
}

export interface CategorizedCommands {
    category: string;
    commands: CommandInfo[];
}

/**
 * コマンド情報を一元管理するサービスクラス
 */
class CommandService {
    private static instance: CommandService = new CommandService();
    private commands: CommandInteraction[] = [];
    /**
     * シングルトンインスタンスを取得する
     */
    public static getInstance(): CommandService {
        return CommandService.instance;
    }
    /**
     * commandHandlerを受け取ってサービスを初期化するメソッドを新しく作る
     * @param commandHandler CommandHandlerのインスタンス
     */
    public initialize(commandHandler: CommandHandler): void {
        this.commands = commandHandler._commands.filter((c): c is CommandInteraction => {
            return !!(c.command && 'category' in c.command && typeof c.command.category === 'string');
        });
    }
    /**
     * 指定された名前のコマンド情報を取得する
     * @param name コマンド名
     * @returns コマンド情報
     */
    public findCommandName(name: string): CommandInteraction | undefined {
        return this.commands.find((c) => c.command.name === name);
    }

    /**
     * オートコンプリート用のコマンド名リストを取得する
     * @returns コマンド名の配列
     */
    public getCommandNames(): string[] {
        return this.commands.map((c) => c.command.name);
    }

    /**
     * コマンドをカテゴリーごとに分類して取得する
     * @returns カテゴリーごとのコマンドリスト
     */
    public getCommandsCategory(): CategorizedCommands[] {
        const commandsCategory: Record<string, CommandInfo[]> = {};

        for (const cmd of this.commands) {
            const category = cmd.command.category;
            if (!category) continue;

            if (!(category in commandsCategory)) {
                commandsCategory[category] = [];
            }

            commandsCategory[category].push({
                name: cmd.command.name,
                description: cmd.command.description
            });
        }

        return Object.entries(commandsCategory).map(([category, commands]) => ({
            category,
            commands
        }));
    }
}

export default CommandService.getInstance();
