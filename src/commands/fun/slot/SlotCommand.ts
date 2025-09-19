import { ChatInputCommandInteraction } from 'discord.js';

import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { CommandInteraction } from '../../base/command_base.js';
// 作成したSlotEmbedをインポートします
import SlotEmbed from './SlotEmbed.js'; // パスは実際のファイル位置に合わせてください

const REELS = ['7️⃣', '🍒', '🍋', '🔔', '🍉', '⭐', '💎'];
/**
 * スロットコマンド
 */
class SlotCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder().setName('slot').setDescription('スロットを回します').setCategory('お遊び系').setUsage('`/slot`');

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        // SlotEmbedを使って回転中のEmbedを生成
        const rotatingEmbed = SlotEmbed.createRotatingEmbed(interaction);
        await interaction.editReply({ embeds: [rotatingEmbed] });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const results = [
            REELS[Math.floor(Math.random() * REELS.length)],
            REELS[Math.floor(Math.random() * REELS.length)],
            REELS[Math.floor(Math.random() * REELS.length)]
        ];

        // SlotEmbedを使って結果のEmbedを生成
        const finalEmbed = SlotEmbed.createResultEmbed(interaction, results);
        await interaction.editReply({ embeds: [finalEmbed] });
    }

    // Embed生成に関連するメソッドはSlotEmbedクラスに移動したため、不要になります。
}

export default new SlotCommand();
