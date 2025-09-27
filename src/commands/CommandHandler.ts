import { ApplicationCommandDataResolvable, Interaction } from 'discord.js';

import { client } from '../index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/log.js';
import { IActionInteraction } from './base/action_base.js';
import { AutocompleteCommandInteraction, CommandGroupInteraction, CommandInteraction, SubCommandInteraction } from './base/command_base.js';
import { InteractionBase } from './base/interaction_base.js';

export default class CommandHandler {
    private readonly commandMap = new Map<string, InteractionBase>();
    private readonly actionMap = new Map<string, IActionInteraction>();

    public readonly commands: InteractionBase[] = [];
    public readonly actions: IActionInteraction[] = [];

    private commandCount = 0;
    private subCommandCount = 0;

    /**
     * コマンドハンドラーを初期化します
     * @param allInteractions 全インタラクションのリスト
     */
    public constructor(allInteractions: InteractionBase[] = []) {
        allInteractions.forEach((interaction) => {
            const potentialAction = interaction as unknown as IActionInteraction;
            if (typeof potentialAction.id === 'string') {
                this.actions.push(potentialAction);
                this.actionMap.set(potentialAction.id, potentialAction);
            }

            if (interaction instanceof SubCommandInteraction) {
                this.subCommandCount++;
                const parent = interaction.registry;
                if (parent instanceof CommandGroupInteraction) {
                    const fullName = `${parent.command.name} ${interaction.command.name}`;
                    this.commandMap.set(fullName, interaction);
                }
            } else if (interaction instanceof CommandGroupInteraction) {
                this.commandCount++;
                this.commandMap.set(interaction.command.name, interaction);
            } else if (interaction instanceof CommandInteraction) {
                this.commandCount++;
                this.commandMap.set(interaction.command.name, interaction);
            } else if (interaction instanceof AutocompleteCommandInteraction) {
                this.commandCount++;
                this.commandMap.set(interaction.command.name, interaction);
            }

            if (interaction.command?.name) {
                this.commands.push(interaction);
            }
        });

        logger.info(
            `読み込まれたコマンド: ${String(this.commandCount)}件, サブコマンド: ${String(this.subCommandCount)}件, アクション: ${String(this.actions.length)}件`
        );
    }

    /**
     * コマンドをDiscord APIに登録します
     */
    public async registerCommands(): Promise<void> {
        const guild = await client.guilds.fetch(config.guildId);
        const applicationCommands: ApplicationCommandDataResolvable[] = [];

        this.commands.forEach((command) => {
            command.registerSubCommands();
            command.registerCommands(applicationCommands);
        });
        await guild.commands.set(applicationCommands);
        logger.info(`${String(applicationCommands.length)}個のコマンドを登録しました。`);
    }

    /**
     * イベントコマンドを処理します
     * @param interaction インタラクション
     */
    public async onInteractionCreate(interaction: Interaction): Promise<void> {
        try {
            if (interaction.isChatInputCommand()) {
                const subcommand = interaction.options.getSubcommand(false);
                const commandKey = subcommand ? `${interaction.commandName} ${subcommand}` : interaction.commandName;

                const command = this.commandMap.get(commandKey);

                if (command) {
                    await command.onInteractionCreate(interaction);
                } else {
                    logger.warn(`不明なコマンドキー[${commandKey}]が実行されました。`);
                }
                return;
            }

            if ('customId' in interaction && typeof interaction.customId === 'string') {
                const params = new URLSearchParams(interaction.customId);
                const actionId = params.get('_');

                if (actionId) {
                    const action = this.actionMap.get(actionId);
                    if (action) {
                        await action.onInteractionCreate(interaction);
                    } else {
                        logger.warn(`不明なアクションID[${actionId}]を持つインタラクションが実行されました。`);
                    }
                }
                return;
            }
        } catch (error) {
            logger.error(`インタラクション処理中にエラーが発生しました。`, error, interaction.toJSON());

            const replyOptions = {
                content: '処理中にエラーが発生しました。',
                ephemeral: true
            };

            if (interaction.isRepliable()) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(replyOptions);
                } else {
                    await interaction.reply(replyOptions);
                }
            }
        }
    }
}
