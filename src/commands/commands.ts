import { InteractionBase } from './base/interaction_base.js';
import pingCommand from './general/ping/PingCommand.js';

const commands: InteractionBase[] = [
    pingCommand
];

export default commands;