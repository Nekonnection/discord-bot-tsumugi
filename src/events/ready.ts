import { logger } from '../utils/log';
import { EventBase } from './base/event_base';
import { client, commandHandler } from '..';

export let totalGuilds = '情報取得中...';
export let totalUsers = '情報取得中...';
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
    };

    private async setActivityInterval() {
        setInterval(async () => {
            client.user?.setActivity({
                name: `/help | Servers: ${totalGuilds} | Users: ${totalUsers} | ${client.ws.ping}ms`
            });
        }, 10000);

        setInterval(async () => {
            totalGuilds = await this.checkTotalGuilds();
            totalUsers = await this.checkTotalUsers();
            totalUsers;
        }, 60000);
    }

    public async checkTotalGuilds(): Promise<string> {
        return client.guilds.cache.size.toString();
    }
    public async checkTotalUsers(): Promise<string> {
        let totalMembers = 0;

        for (const guild of client.guilds.cache.values()) {
            await guild.members.fetch();
            totalMembers += guild.memberCount;
        }
        return totalMembers.toString();
    }
}

export default new ReadyEvent();
