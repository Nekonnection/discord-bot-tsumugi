import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomSlashCommandBuilder from "../../../utils/CustomSlashCommandBuilder";
import { CommandInteraction } from "../../base/command_base";

type Hand = 'rock' | 'scissors' | 'paper';

const HANDS: Record<Hand, { name: string; value: Hand }> = {
    rock: { name: 'グー✊', value: 'rock' },
    scissors: { name: 'チョキ✌️', value: 'scissors' },
    paper: { name: 'パー✋', value: 'paper' },
};

const CHOICES = Object.values(HANDS);
const BOT_HANDS = Object.keys(HANDS) as Hand[];

const WINS_AGAINST: Record<Hand, Hand> = {
    rock: 'scissors',
    scissors: 'paper',
    paper: 'rock',
};

const RESULTS = {
    WIN: { message: 'あなたの勝ちです！🎉', color: 0x57F287 },
    LOSE: { message: 'あなたの負けです...😢', color: 0xED4245 },
    DRAW: { message: 'あいこです！🤝', color: 0xFEE75C },
};

class JankenCommand extends CommandInteraction {
    command = new CustomSlashCommandBuilder()
        .setName('rpc')
        .setDescription('Botとじゃんけんをします。')
        .setCategory('お遊び系')
        .setUsage('`/rpc hand:[グー/チョキ/パー]`')
        .addStringOption((option) =>
            option.setName('hand')
                .setDescription('あなたの手を選んでください。')
                .setRequired(true)
                .addChoices(...CHOICES)
        ) as CustomSlashCommandBuilder;

    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const userHand = interaction.options.getString('hand', true) as Hand;
        const botHand = BOT_HANDS[Math.floor(Math.random() * BOT_HANDS.length)];

        let result;
        if (userHand === botHand) {
            result = RESULTS.DRAW;
        } else if (WINS_AGAINST[userHand] === botHand) {
            result = RESULTS.WIN;
        } else {
            result = RESULTS.LOSE;
        }
        
        const embed = new EmbedBuilder()
            .setTitle('じゃんけんぽん！')
            .setDescription(result.message)
            .addFields(
                { name: 'あなたの手', value: HANDS[userHand].name, inline: true },
                { name: 'Botの手', value: HANDS[botHand].name, inline: true }
            )
            .setColor(result.color)
            .setFooter({
                text: `実行者: ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL() || undefined,
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
}

export default new JankenCommand();