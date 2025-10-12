import readyEvent from './ClientReadyEvent.js';
import guildCreate from './GuildCreateEvent.js';
import interactionCreateEvent from './InteractionCreateEvent.js';
import messageCreate from './MessageCreateEvent.js';

const events = [readyEvent, guildCreate, interactionCreateEvent, messageCreate];

export default events;
