import { copyFileSync, existsSync, readFileSync } from 'fs';
import { exit } from 'process';
import { parse } from 'toml';

import { logger } from './log.js';
import { getWorkdirPath } from './workdir.js';

/**
 * コンフィグファイルの構造
 */
export interface Config {
    clientId: string;
    guildId: string;
    botColor: string;
    iconURL: string;
    inviteURL: string;
    announcementGuildId: string;
    announcementChannelId: string;
    supportGuildURL: string;
}

// config.tomlが存在しない場合は、config.default.tomlをコピーする。
if (!existsSync(getWorkdirPath('config.toml'))) {
    copyFileSync(getWorkdirPath('config.default.toml'), getWorkdirPath('config.toml'));
}

// コンフィグファイルを読み込む
export const config: Config = ((): Config => {
    try {
        return parse(readFileSync(getWorkdirPath('config.toml'), 'utf-8')) as Config;
    } catch (error) {
        logger.error('コンフィグの読み込みに失敗しました', error);
        exit(1);
    }
})();
