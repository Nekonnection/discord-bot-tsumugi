import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';
import helpCommand from './general/help/HelpCommand.js';
import helpSelectMenuAction from './general/help/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/HelpOperationMenuAction.js';
import botCommand from './general/bot/BotCommand.js';
import shitCommand from '../commands/unti/shit.js';
import omikujiCommand from './fun/omikuji/OmikujiCommand.js';
import followCommand from '../commands/general/follow/FollowCommand.js'

const commands: InteractionBase[] = [pingCommand, helpCommand, helpSelectMenuAction, helpOperationMenuAction, botCommand, omikujiCommand, shitCommand, followCommand];

export default commands;
