import { Interaction } from 'discord.js';

import { commandHandler } from '../index.js';
import { EventBase } from './base/event_base.js';

/**
 * インタラクションが作成されたときに実行されるイベント
 */
class InteractionCreateEvent extends EventBase<'interactionCreate'> {
    public eventName = 'interactionCreate' as const;

    public async listener(interaction: Interaction): Promise<void> {
        await commandHandler.onInteractionCreate(interaction);
    }
}

export default new InteractionCreateEvent();
