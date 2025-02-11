import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';
import helpCommand from './general/help/HelpCommand.js';
import helpSelectMenuAction from './general/help/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/HelpOperationMenuAction.js';
import botCommand from './general/bot/BotCommand.js';
import shitCommand from '../commands/unti/shit.js';
import OmikujiCommand from './fun/omikuji/OmikujiCommand.js';

const commands: InteractionBase[] = [pingCommand, helpCommand, helpSelectMenuAction, helpOperationMenuAction, botCommand, OmikujiCommand, shitCommand];

export default commands;
