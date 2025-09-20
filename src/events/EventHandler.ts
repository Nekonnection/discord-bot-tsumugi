import { Client, ClientEvents } from 'discord.js';

import { EventBase } from './base/event_base.js';

type AnyEventBase = {
    [K in keyof ClientEvents]: EventBase<K>;
}[keyof ClientEvents];

/**
 * イベントハンドラークラス
 */
export default class EventHandler {
    /**
     * コンストラクタ
     * @param _events イベントリスト
     */
    public constructor(private _events: AnyEventBase[]) {}

    /**
     * イベントを登録する関数
     * @param client Discordクライアント
     */
    public registerEvents(client: Client): void {
        this._events.forEach((event) => {
            event.register(client);
        });
    }
}
