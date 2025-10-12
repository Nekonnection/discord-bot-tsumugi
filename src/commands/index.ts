import { InteractionBase } from './base/interaction_base.js';
import omikujiCommand from './fun/omikuji/OmikujiCommand.js';
import rpsCommand from './fun/rps/RPCCommand.js';
import slotCommand from './fun/slot/SlotCommand.js';
import botCommand from './general/bot/BotCommand.js';
import followCommand from './general/follow/FollowCommand.js';
import guildCommand from './general/guild/GuildCommand.js';
import helpSelectMenuAction from './general/help/actions/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/actions/HelpOperationMenuAction.js';
import helpCommand from './general/help/HelpCommand.js';
import pingCommand from './general/ping/PingCommand.js';
import userCommand from './general/user/UserCommand.js';
import keywordAddModal from './keywordChat/action/KeywordAddModal.js';
import keywordListMenuAction from './keywordChat/action/KeywordListMenuAction.js';
import keywordAddCommand from './keywordChat/KeywordAddCommand.js';
import keywordCommandGroup from './keywordChat/KeywordCommandGroup.js';
import keywordListCommand from './keywordChat/KeywordListCommand.js';
import keywordRemoveCommand from './keywordChat/KeywordRemoveCommand.js';

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
    keywordAddCommand,
    keywordAddModal,
    keywordCommandGroup,
    keywordRemoveCommand,
    keywordListCommand,
    keywordListMenuAction,
    userCommand,
    guildCommand
];

export default commands;
