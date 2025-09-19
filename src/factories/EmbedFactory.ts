import { EmbedBuilder, User } from 'discord.js';

import { config } from '../utils/config.js'; // パスは適宜修正してください

/**
 * アプリケーション全体で共通のEmbedを生成するクラス
 */
export class EmbedFactory {
    /**
     * エラーEmbedを作成する
     */
    public createErrorEmbed(user: User, message: string): EmbedBuilder {
        return this.createBaseEmbed(user)
            .setColor('Red') // エラーなので色を赤に
            .setTitle('❌ エラー')
            .setDescription(message);
    }

    /**
     * Embedの共通フッターなどを設定するベースメソッド
     */
    public createBaseEmbed(user: User): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTimestamp()
            .setFooter({
                text: `実行者: ${user.displayName}`,
                iconURL: user.displayAvatarURL() || undefined
            });
    }
}
