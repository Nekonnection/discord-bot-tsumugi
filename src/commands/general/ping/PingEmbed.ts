import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';

/**
 * Pingコマンドの埋め込みメッセージを作成する
 */
class PingEmbed {
    private readonly embedFactory = new EmbedFactory();
    /**
     * Ping測定中のEmbedを作成します。
     * @param interaction コマンドのインタラクション
     * @returns 作成されたEmbedBuilder
     */
    public createPingingEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        return this.embedFactory.createBaseEmbed(interaction.user).setTitle('Pingを測定中...');
    }

    /**
     * Ping測定結果のEmbedを作成します。
     * @param interaction コマンドのインタラクション
     * @param replyMessage `fetchReply()`で取得した返信メッセージ
     * @returns 作成されたEmbedBuilder
     */
    public createResultEmbed(interaction: ChatInputCommandInteraction, replyMessage: Message): EmbedBuilder {
        const wsPing = interaction.client.ws.ping;
        const apiLatency = replyMessage.createdTimestamp - interaction.createdTimestamp;

        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setTitle('Pingを測定しました')
            .setFields(
                {
                    name: 'WebSocket Ping',
                    value: `${String(wsPing)}ms`
                },
                {
                    name: 'APIレイテンシ',
                    value: `${String(apiLatency)}ms`
                }
            );
    }
}

export default new PingEmbed();
