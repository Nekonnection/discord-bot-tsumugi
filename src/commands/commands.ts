import followCommand from '../commands/general/follow/FollowCommand.js';
import { InteractionBase } from './base/interaction_base.js';
import omikujiCommand from './fun/omikuji/OmikujiCommand.js';
import rpsCommand from './fun/rps/rpsCommand.js';
import slotCommand from './fun/slot/SlotCommand.js';
import botCommand from './general/bot/BotCommand.js';
import helpSelectMenuAction from './general/help/actions/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/actions/HelpOperationMenuAction.js';
import helpCommand from './general/help/HelpCommand.js';
import pingCommand from './general/ping/PingCommand.js';

const commands: InteractionBase[] = [
    pingCommand,
    helpCommand,
    helpSelectMenuAction,
    helpOperationMenuAction,
    botCommand,
    omikujiCommand,
    followCommand,
    slotCommand,
    rpsCommand
];

export default commands;
