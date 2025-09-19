import { Interaction } from 'discord.js';

import { commandHandler } from '../index.js';
import { logger } from '../utils/log.js';
import { EventBase } from './base/event_base.js';

/**
 * インタラクションが作成されたときに実行されるイベント
 */
class InteractionCreateEvent extends EventBase<'interactionCreate'> {
    public eventName = 'interactionCreate' as const;

    public async listener(interaction: Interaction): Promise<void> {
        try {
            await commandHandler.onInteractionCreate(interaction);
        } catch (error) {
            logger.error('onInteractionCreate中にエラーが発生しました。', error);
            return;
        }
    }
}

export default new InteractionCreateEvent();
