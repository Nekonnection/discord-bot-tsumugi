import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"; // EmbedBuilder をインポート
import CustomSlashCommandBuilder from "../../../utils/CustomSlashCommandBuilder";
import { CommandInteraction } from "../../base/command_base";
import { config } from "../../../utils/config";

const REELS = ['7️⃣', '🍒', '🍋', '🔔', '🍉', '⭐', '💎'];

class SlotCommand extends CommandInteraction {
    command = new CustomSlashCommandBuilder()
        .setName('slot')
        .setDescription('スロットを回します')
        .setCategory('お遊び系')
        .setUsage('`/slot`');

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const rotatingEmbed = this.createBaseEmbed(interaction)
            .setTitle('スロットを回しています...')
            .setDescription('**回** | **転** | **中**\n**転** | **中** | **回**\n**中** | **回** | **転**')

        await interaction.editReply({ embeds: [rotatingEmbed] });

        await new Promise(resolve => setTimeout(resolve, 1500));

        const results = [
            REELS[Math.floor(Math.random() * REELS.length)],
            REELS[Math.floor(Math.random() * REELS.length)],
            REELS[Math.floor(Math.random() * REELS.length)],
        ];

        const finalEmbed = this.createResultEmbed(interaction, results);
        
        await interaction.editReply({ embeds: [finalEmbed] });
    }

    /**
     * Embedの共通部分（フッター）を持つEmbedBuilderインスタンスを生成するメソッド
     */
    private createBaseEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setFooter({ 
                text: `実行者: ${interaction.user.username}`, 
                iconURL: interaction.user.displayAvatarURL() || undefined 
            });
    }
    
    /**
     * スロットの結果から最終的なEmbedBuilderインスタンスを生成するメソッド
     */
    private createResultEmbed(interaction: ChatInputCommandInteraction, results: string[]): EmbedBuilder {
        const [r1, r2, r3] = results;
        const resultLine = `**${r1} | ${r2} | ${r3}**`;
        
        const embed = this.createBaseEmbed(interaction);

        embed.setTitle('スロットの結果').setDescription(`${resultLine}`)
        return embed;
    }
}

export default new SlotCommand();