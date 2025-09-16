import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';
import helpCommand from './general/help/HelpCommand.js';
import helpSelectMenuAction from './general/help/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/HelpOperationMenuAction.js';
import botCommand from './general/bot/BotCommand.js';
import followCommand from '../commands/general/follow/FollowCommand.js';
import omikujiCommand from './fun/omikuji/OmikujiCommand.js';
import slotCommand from './fun/slot/SlotCommand.js';
import rpsCommand from './fun/rps/rpsCommand.js';

const commands: InteractionBase[] = [
    pingCommand,
    helpCommand,
    helpSelectMenuAction,
    helpOperationMenuAction,
    botCommand,
    omikujiCommand,
    followCommand,
    slotCommand,
    rpsCommand,
];

export default commands;
