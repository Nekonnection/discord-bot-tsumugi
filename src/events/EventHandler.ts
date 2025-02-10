import { Client, ClientEvents } from 'discord.js';
import { EventBase } from './base/event_base.js';

/**
 * イベントハンドラークラス
 */
export default class EventHandler {
    /**
     * コンストラクタ
     * @param _events イベントリスト
     */
    constructor(private _events: EventBase<keyof ClientEvents>[]) {}

    /**
     * イベントを登録する関数
     * @param client Discordクライアント
     */
    registerEvents(client: Client): void {
        this._events.forEach((event) => event.register(client));
    }
}