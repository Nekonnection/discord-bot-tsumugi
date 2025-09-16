import { ClientEvents } from 'discord.js';

import { EventBase } from './base/event_base.js';
import interactionCreateEvent from './interactionCreate.js';
import readyEvent from './ready.js';

const events: EventBase<keyof ClientEvents>[] = [readyEvent, interactionCreateEvent];

export default events;
