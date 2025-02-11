import { EventBase } from './base/event_base';
import readyEvent from './ready';
import interactionCreateEvent from './interactionCreate';
import { ClientEvents } from 'discord.js';

const events: EventBase<keyof ClientEvents>[] = [readyEvent, interactionCreateEvent];

export default events;
