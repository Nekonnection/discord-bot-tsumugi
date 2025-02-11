import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';
import helpCommand from './general/help/HelpCommand.js';
import helpSelectMenuAction from './general/help/HelpCategoryMenuAction.js';
import helpOperationMenuAction from './general/help/HelpOperationMenuAction.js';
import ShitCommands from '../commands/unti/shit.js';

const commands: InteractionBase[] = [pingCommand, helpCommand, helpSelectMenuAction, helpOperationMenuAction, ShitCommands];

export default commands;
