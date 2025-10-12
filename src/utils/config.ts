import { readFileSync } from 'fs';
import path from 'path';
import { exit } from 'process';
import { parse } from 'toml';

import { logger } from './log.js';

/**
 * コンフィグファイルの構造
 */
export interface Config {
    clientId: string;
    guildId: string;
    botColor: string;
    errorColor: string;
    iconURL: string;
    inviteURL: string;
    announcementChannelId: string;
    botEntranceChannelId: string;
    supportGuildURL: string;
    errorEmoji: string;
    botEmoji: string;
    memberEmoji: string;
    emoji: string;
    gifEmoji: string;
    statusEmoji: Record<string, string>;
    channelEmoji: Record<string, string>;
}
export const config: Config = ((): Config => {
    const env = process.env.NODE_ENV ?? 'development';
    const configFileName = `${env}.toml`;

    const absoluteConfigPath = path.resolve('config', configFileName);

    try {
        logger.info(`コンフィグファイル(${absoluteConfigPath})を読み込みます...`);
        const tomlContent = readFileSync(absoluteConfigPath, 'utf-8');
        return parse(tomlContent) as unknown as Config;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            logger.error(`コンフィグファイルが見つかりません: ${absoluteConfigPath}`);
        } else {
            logger.error(`コンフィグファイル(${absoluteConfigPath})の読み込みまたは解析に失敗しました。`, error);
        }
        exit(1);
    }
})();
