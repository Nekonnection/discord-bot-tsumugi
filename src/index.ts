import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits, Partials } from 'discord.js';

import CommandHandler from './commands/CommandHandler.js';
import commands from './commands/index.js';
import EventHandler from './events/EventHandler.js';
import events from './events/events.js';
import CommandService from './services/CommandService.js';

export const prisma = new PrismaClient();

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
        GatewayIntentBits.GuildPresences
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
