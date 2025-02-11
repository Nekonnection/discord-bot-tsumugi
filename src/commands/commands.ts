import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';
import helpCommand from './general/help/HelpCommand.js';

const commands: InteractionBase[] = [pingCommand, helpCommand];

export default commands;
