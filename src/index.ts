import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import EventHandler from './events/EventHandler';
import events from './events/events';
import CommandHandler from './commands/CommandHandler';
import commands from './commands/commands';

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
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Message, Partials.Channel],
});

/**
 * コマンドハンドラーを初期化する
 */
export const commandHandler = new CommandHandler(commands);

/**
 * イベントハンドラーを登録する
 */
const eventHandler = new EventHandler(events);
eventHandler.registerEvents(client);

// Discord Botのログイン
client.login(process.env.DISCORD_TOKEN);