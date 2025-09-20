import { ApplicationCommandDataResolvable, Interaction } from 'discord.js';

import { client } from '../index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/log.js';
import { InteractionBase } from './base/interaction_base.js';

/**
 * コマンドハンドラー
 */
export default class CommandHandler {
    private readonly commandsMap = new Map<string, InteractionBase>();
    /**
     * コマンドハンドラーを初期化します
     * @param _commands コマンドリスト
     */
    public constructor(public _commands: InteractionBase[]) {
        const commandsWithNames = _commands.filter(
            (command): command is InteractionBase & { command: { name: string } } => command.command?.name !== undefined
        );

        this.commandsMap = new Map(commandsWithNames.map((command) => [command.command.name, command]));
    }

    /**
     * コマンドを登録します
     */
    public async registerCommands(): Promise<void> {
        // サーバーを取得
        const guild = await client.guilds.fetch(config.guildId);
        // 登録するコマンドリスト
        const applicationCommands: ApplicationCommandDataResolvable[] = [];

        // サブコマンドを構築
        this._commands.forEach((command) => {
            command.registerSubCommands();
        });

        // コマンドを構築
        this._commands.forEach((command) => {
            command.registerCommands(applicationCommands);
        });

        // コマンドを登録
        await guild.commands.set(applicationCommands);
    }

    /**
     * イベントコマンドを処理します
     * @param interaction インタラクション
     */
    public async onInteractionCreate(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

        const command = this.commandsMap.get(interaction.commandName);

        if (!command) {
            logger.warn(`コマンドが見つかりません: ${interaction.commandName}`);
            return;
        }
        try {
            await command.onInteractionCreate(interaction);
        } catch (error) {
            logger.error('onInteractionCreate中にエラーが発生しました。', error);
        }
    }
}
