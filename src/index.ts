import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';

import CommandHandler from './commands/CommandHandler.js';
import commands from './commands/commands.js';
import EventHandler from './events/EventHandler.js';
import events from './events/events.js';
import CommandService from './services/CommandService.js';

/**
 * .envファイルを読み込む
 */
dotenv.config();

/**
 * Discord Client
 */
export const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Message, Partials.Channel]
});

/**
 * コマンドハンドラーを初期化する
 */
export const commandHandler = new CommandHandler(commands);
CommandService.initialize(commandHandler);

/**
 * イベントハンドラーを登録する
 */
const eventHandler = new EventHandler(events);
eventHandler.registerEvents(client);

// Discord Botのログイン
void client.login(process.env.DISCORD_TOKEN);
