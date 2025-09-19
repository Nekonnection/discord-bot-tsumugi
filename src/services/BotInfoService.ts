import pkg from '../../package.json' with { type: 'json' };
import ReadyEvent from '../events/ready.js';
import { client } from '../index.js';

// ボット情報のデータ構造を定義
export interface BotInfo {
    username: string;
    version: string;
    createdAt: Date;
    guildCount: string;
    userCount: string;
}

/**
 * Botの情報を一元管理するサービスクラス
 */
class BotInfoService {
    private static instance: BotInfoService = new BotInfoService();

    public static getInstance(): BotInfoService {
        return BotInfoService.instance;
    }

    /**
     * Botに関する情報をまとめて取得する
     * @returns Bot情報のオブジェクト
     */
    public getBotInfo(): BotInfo {
        return {
            username: client.user?.username ?? '不明なBot',
            version: pkg.version,
            createdAt: client.user?.createdAt ?? new Date(),
            guildCount: ReadyEvent.checkTotalGuilds(),
            userCount: ReadyEvent.checkTotalUsers()
        };
    }
}

export default BotInfoService.getInstance();
