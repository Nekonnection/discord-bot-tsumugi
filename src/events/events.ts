import readyEvent from './ClientReadyEvent.js';
import guildCreate from './GuildCreateEvent.js';
import guildDelete from './GuildDeleteEvent.js';
import interactionCreateEvent from './InteractionCreateEvent.js';
import messageCreate from './MessageCreateEvent.js';

const events = [readyEvent, guildCreate, guildDelete, interactionCreateEvent, messageCreate];

export default events;
