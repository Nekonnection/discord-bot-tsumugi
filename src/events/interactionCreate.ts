import { Interaction } from 'discord.js';
import { logger } from '../utils/log';
import { EventBase } from './base/event_base';
import { commandHandler } from '..';

/**
 * インタラクションが作成されたときに実行されるイベント
 */
class InteractionCreateEvent extends EventBase<'interactionCreate'> {
    readonly eventName = 'interactionCreate' as const;

    listener = async (interaction: Interaction) => {
        try {
            await commandHandler.onInteractionCreate(interaction);
        } catch (error) {
            logger.error('onInteractionCreate中にエラーが発生しました。', error);
        }
    };
}

export default new InteractionCreateEvent();