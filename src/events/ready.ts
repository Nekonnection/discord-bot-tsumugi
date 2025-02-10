import { logger } from '../utils/log';
import { EventBase } from './base/event_base';
import { client, commandHandler } from '..';

/**
 * クライアントが準備完了したときに実行されるイベント
 */
class ReadyEvent extends EventBase<'ready'> {
    readonly eventName = 'ready' as const;

    listener = async () => {
        try {
            this.setActivityInterval();
            await commandHandler.registerCommands();
            logger.info(`起動完了: ${client.user?.tag}`);
        } catch (error) {
            logger.error('onReady中にエラーが発生しました。', error);
        }
    }

    private setActivityInterval() {
        setInterval(() => {
            client.user?.setActivity({
                name: `${client.ws.ping}ms`,
            });
        }, 10000);
    }
}

export default new ReadyEvent();
