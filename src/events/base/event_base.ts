import { Client, ClientEvents } from 'discord.js';

/**
 * イベントベースの抽象クラス
 */
export abstract class EventBase<K extends keyof ClientEvents> {
    /**
     * イベント名
     */
    protected abstract eventName: K;

    /**
     * イベントリスナー
     * @param args イベント引数
     */
    protected abstract listener(...args: ClientEvents[K]): Promise<void>;

    /**
     * イベントを登録する関数
     * @param client Discordクライアント
     */
    public register(client: Client): void {
        client.on(this.eventName, (...args) => {
            void this.listener(...args);
        });
    }
}
