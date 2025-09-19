import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';

/**
 * スロットコマンドの埋め込みメッセージを生成する
 */
class SlotEmbed {
    private readonly embedFactory = new EmbedFactory();
    /**
     * スロットが回転している最中のEmbedを作成します。
     * @param interaction コマンドのインタラクション
     * @returns 作成されたEmbedBuilder
     */
    public createRotatingEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        return this.embedFactory
            .createBaseEmbed(interaction.user)
            .setTitle('スロットを回しています...')
            .setDescription('**回** | **転** | **中**\n**転** | **中** | **回**\n**中** | **回** | **転**');
    }

    /**
     * スロットの結果を表示するEmbedを作成します。
     * @param interaction コマンドのインタラクション
     * @param results スロットの結果（絵文字の配列）
     * @returns 作成されたEmbedBuilder
     */
    public createResultEmbed(interaction: ChatInputCommandInteraction, results: string[]): EmbedBuilder {
        const [r1, r2, r3] = results;
        const resultLine = `**${r1} | ${r2} | ${r3}**`;
        const embed = this.embedFactory.createBaseEmbed(interaction.user).setTitle('スロットの結果').setDescription(resultLine);

        if (r1 === r2 && r2 === r3) {
            embed.addFields({ name: '結果', value: '🎉 **大当たり！** 🎉' });
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            embed.addFields({ name: '結果', value: '惜しい！' });
        }

        return embed;
    }
}

export default new SlotEmbed();
