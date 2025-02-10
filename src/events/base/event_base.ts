import { Client, ClientEvents } from 'discord.js';

/**
 * イベントベースの抽象クラス
 */
export abstract class EventBase<K extends keyof ClientEvents> {
    /**
     * イベント名
     */
    abstract eventName: K;

    /**
     * イベントリスナー
     * @param args イベント引数
     */
    abstract listener(...args: ClientEvents[K]): void;

    /**
     * イベントを登録する関数
     * @param client Discordクライアント
     */
    register(client: Client): void {
        client.on(this.eventName, this.listener);
    }
}
