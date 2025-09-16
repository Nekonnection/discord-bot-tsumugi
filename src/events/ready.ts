import { ActivityType } from 'discord.js';

import { client, commandHandler } from '../index.js';
import { logger } from '../utils/log.js';
import { EventBase } from './base/event_base.js';

class ReadyEvent extends EventBase<'ready'> {
    public eventName = 'ready' as const;
    public static totalGuilds = '情報取得中...';
    public static totalUsers = '情報取得中...';
    private updateInterval = 15000;

    public async listener(): Promise<void> {
        try {
            await commandHandler.registerCommands();
            this.updateStatsAndActivity();
            this.startUpdateLoop();
            logger.info(`起動完了: ${client.user?.tag ?? 'Unknown User'}`);
        } catch (error) {
            logger.error('onReady中にエラーが発生しました。', error);
        }
    }

    private startUpdateLoop(): void {
        ((): void => {
            try {
                this.updateStatsAndActivity();
            } catch (error) {
                logger.error('ステータスの定期更新中にエラーが発生しました。', error);
            } finally {
                setTimeout(() => {
                    this.startUpdateLoop();
                }, this.updateInterval);
            }
        })();
    }

    private updateStatsAndActivity(): void {
        ReadyEvent.totalGuilds = this.checkTotalGuilds();
        ReadyEvent.totalUsers = this.checkTotalUsers();

        const name = `/help | Servers: ${ReadyEvent.totalGuilds} | Users: ${ReadyEvent.totalUsers}`;

        client.user?.setActivity({ name, type: ActivityType.Playing });
    }

    public checkTotalGuilds(): string {
        return client.guilds.cache.size.toString();
    }

    public checkTotalUsers(): string {
        return client.guilds.cache.reduce((sum, guild) => sum + guild.memberCount, 0).toString();
    }
}

export default new ReadyEvent();
