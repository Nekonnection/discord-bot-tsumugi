import { ActivityType } from 'discord.js';

import { client, commandHandler } from '../index.js';
import { logger } from '../utils/log.js';
import { EventBase } from './base/event_base.js';

class ClientReadyEvent extends EventBase<'clientReady'> {
    public eventName = 'clientReady' as const;
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
            logger.error('ClientReadyEventでエラーが発生', error);
        }
    }

    private startUpdateLoop(): void {
        ((): void => {
            try {
                this.updateStatsAndActivity();
            } catch (error) {
                logger.error('ステータスの定期更新中にエラーが発生', error);
            } finally {
                setTimeout(() => {
                    this.startUpdateLoop();
                }, this.updateInterval);
            }
        })();
    }

    private updateStatsAndActivity(): void {
        ClientReadyEvent.totalGuilds = this.checkTotalGuilds();
        ClientReadyEvent.totalUsers = this.checkTotalUsers();

        const name = `/help | Servers: ${ClientReadyEvent.totalGuilds} | Users: ${ClientReadyEvent.totalUsers}`;

        client.user?.setActivity({ name, type: ActivityType.Playing });
    }

    public checkTotalGuilds(): string {
        return client.guilds.cache.size.toString();
    }

    public checkTotalUsers(): string {
        return client.guilds.cache.reduce((sum, guild) => sum + guild.memberCount, 0).toString();
    }
}

export default new ClientReadyEvent();
