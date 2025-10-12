import { ApplicationCommandDataResolvable, Interaction, MessageFlags } from 'discord.js';

import { EmbedFactory } from '../factories/EmbedFactory.js';
import { client } from '../index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/log.js';
import { IActionInteraction } from './base/action_base.js';
import { AutocompleteCommandInteraction, CommandGroupInteraction, CommandInteraction, SubCommandInteraction } from './base/command_base.js';
import { InteractionBase } from './base/interaction_base.js';

/**
 * コマンドハンドラー
 */
export default class CommandHandler {
    private readonly commandMap = new Map<string, InteractionBase>();
    private readonly actionMap = new Map<string, IActionInteraction>();

    public readonly commands: InteractionBase[] = [];
    public readonly actions: IActionInteraction[] = [];

    private commandCount = 0;
    private subCommandCount = 0;

    private static readonly actionIdKey = '_';

    private readonly embedFactory = new EmbedFactory();
    /**
     * コマンドハンドラーを初期化する
     * @param allInteractions 全インタラクションのリスト
     */
    public constructor(allInteractions: InteractionBase[] = []) {
        allInteractions.forEach((interaction) => {
            this.registerInteraction(interaction);
        });

        logger.info(
            `読み込まれたコマンド: ${String(this.commandCount)}件, サブコマンド: ${String(this.subCommandCount)}件, アクション: ${String(this.actions.length)}件`
        );
    }

    /**
     * コマンドをDiscord APIに登録する
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
     * Interaction発生時に対応する処理を呼び出します
     * @param interaction インタラクション
     */
    public async onInteractionCreate(interaction: Interaction): Promise<void> {
        try {
            if (interaction.isChatInputCommand()) {
                const subcommand = interaction.options.getSubcommand(false);
                const commandKey = subcommand ? `${interaction.commandName} ${subcommand}` : interaction.commandName;
                const command = this.commandMap.get(commandKey);

                if (!command) {
                    logger.warn(`不明なコマンドキー[${commandKey}]が実行されました。`);
                    return;
                }
                await command.onInteractionCreate(interaction);
            } else if ('customId' in interaction && typeof interaction.customId === 'string') {
                const params = new URLSearchParams(interaction.customId);
                const actionId = params.get(CommandHandler.actionIdKey);

                if (!actionId) {
                    return;
                }

                const action = this.actionMap.get(actionId);
                if (!action) {
                    logger.warn(`不明なアクションID[${actionId}]を持つインタラクションが実行されました。`);
                    return;
                }
                await action.onInteractionCreate(interaction);
            } else if (interaction.isAutocomplete()) {
                const command = this.commandMap.get(interaction.commandName);
                if (command && command instanceof AutocompleteCommandInteraction) {
                    await command.onInteractionCreate(interaction);
                }
            }
        } catch (error) {
            logger.error('インタラクションの処理中にエラーが発生しました:', error);
            if (!interaction.isRepliable()) {
                return;
            }
            const errorEmbed = this.embedFactory.createErrorEmbed(
                interaction.user,
                'インタラクションの処理中にエラーが発生しました。時間をおいて再度お試しください。'
            );
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }

    /**
     * 渡されたInteractionを分類し、それぞれのMapに登録する
     * @param interaction 登録するインタラクション
     */
    private registerInteraction(interaction: InteractionBase): void {
        if ('id' in interaction && typeof (interaction as { id: unknown }).id === 'string') {
            const action = interaction as IActionInteraction;
            this.actions.push(action);
            this.actionMap.set(action.id, action);
        }
        if (!interaction.command?.name) {
            return;
        }

        this.commands.push(interaction);

        if (interaction instanceof SubCommandInteraction) {
            this.subCommandCount++;
            const parent = interaction.registry;
            if (parent instanceof CommandGroupInteraction) {
                const fullName = `${parent.command.name} ${interaction.command.name}`;
                this.commandMap.set(fullName, interaction);
            }
        } else if (
            interaction instanceof CommandInteraction ||
            interaction instanceof CommandGroupInteraction ||
            interaction instanceof AutocompleteCommandInteraction
        ) {
            this.commandCount++;
            this.commandMap.set(interaction.command.name, interaction);
        }
    }
}
