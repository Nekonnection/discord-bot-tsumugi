import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { CommandInteraction } from '../../base/command_base';
import { config } from '../../../utils/config';

/**
 * おみくじコマンド
 */
class OmikujiCommand extends CommandInteraction {
    category = 'お遊び系';
    permission = null;
    command = new SlashCommandBuilder().setName('omikuji').setDescription('おみくじが引けます');
    async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const embed = await this.createEmbed(interaction);
        await interaction.editReply({
            embeds: [embed]
        });
    }
    /**
     * 埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @returns 埋め込みメッセージ
     */
    private async createEmbed(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
        const omikuji = await this.createOmikuji()
        return new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}さんのおみくじの結果`)
            .setDescription(omikuji)
            .setColor(Number(config.botColor))
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined })
    }
    /**
     * おみくじを作成する関数
     * @returns おみくじの結果
     */
    private async createOmikuji(): Promise<string> {
        const fortune = await this.selectFortune();
        const hope = await this.selectHope();
        const lostItem = await this.selectLostItem();
        const learning = await this.selectLearning();
        const conflict = await this.selectConflict();
        const love = await this.selectLove();
        const disease = await this.selectDisease();

        const omikujiResult = `
        **運勢**
        ${fortune}

        **願望:** ${hope}
        **失物:** ${lostItem}
        **学問:** ${learning}
        **争事:** ${conflict}
        **恋愛:** ${love}
        **病気:** ${disease}
        `;

        return omikujiResult;
    }

    /**
     * 運勢を選択する関数
     * @returns 運勢
     */
    private async selectFortune(): Promise<string> {
        const fortuneList = [
            { fortune: "大吉", probability: 20 },
            { fortune: "中吉", probability: 15 },
            { fortune: "小吉", probability: 15 },
            { fortune: "吉", probability: 20 },
            { fortune: "末吉", probability: 20 },
            { fortune: "凶", probability: 8 },
            { fortune: "大凶", probability: 2 },
        ];
    
        let totalProbability = fortuneList.reduce((acc, item) => acc + item.probability, 0);
        let random = Math.floor(Math.random() * totalProbability);
    
        let selectedFortune = fortuneList.find(item => {
            if (random < item.probability) {
                return true;
            }
            random -= item.probability;
            return false;
        });
    
        return selectedFortune ? selectedFortune.fortune : "大吉";
    }
    /**
     * リストからランダムなアイテムを選択する関数
     * @param list アイテムのリスト
     * @returns ランダムに選ばれたアイテム
     */
    private async selectRandomItem(list: string[]): Promise<string> {
        return list[Math.floor(Math.random() * list.length)];
    }
    
    /**
     * 願望を選択する関数
     * @returns 願望
     */
    private async selectHope(): Promise<string> {
        const hopeList = [
            "叶う", "全力で願え", "日頃の行いによりけり", "良い事を沢山せよ 叶う", "叶うであろう だが油断禁物。", "叶わない事ありけり"
        ];
        return this.selectRandomItem(hopeList);
    }

    /**
     * 失物を選択する関数
     * @returns 失物
     */
    private async selectLostItem(): Promise<string> {
        const lostItemList = [
            "出る", "出るであろう 下", "出るであろう 上", "出るであろう 周りを見よ", "出るであろう 横", "出るであろう 隙間", "日頃の行いによりけり", "出にくい"
        ];
        return this.selectRandomItem(lostItemList);
    }

    /**
     * 学問を選択する関数
     * @returns 学問
     */
    private async selectLearning(): Promise<string> {
        const learningList = [
            "安心して勉学せよ", "勉学すればよろし", "勉学を推奨する", "困難。勉学せよ", "全力を尽くせ", "自己の甘えを捨てよ"
        ];
        return this.selectRandomItem(learningList);
    }

    /**
     * 争事を選択する関数
     * @returns 争事
     */
    private async selectConflict(): Promise<string> {
        const conflictList = [
            "勝てる 油断禁物", "勝てるであろう", "勝ちがたし", "勝ちがたし 控えよ", "勝ちがたし 時を待て", "困難 諦めよ", "全力を尽くせ", "自己の甘えを捨てよ"
        ];
        return this.selectRandomItem(conflictList);
    }

    /**
     * 恋愛を選択する関数
     * @returns 恋愛
     */
    private async selectLove(): Promise<string> {
        const loveList = [
            "この人を逃すな", "自分磨きをせよ", "感情を抑えよ", "見た目で選ぶな", "中身で選べ", "積極的になれ", "日頃の行いによりけり"
        ];
        return this.selectRandomItem(loveList);
    }

    /**
     * 病気を選択する関数
     * @returns 病気
     */
    private async selectDisease(): Promise<string> {
        const diseaseList = [
            "信じろ なおる", "医者への信心第一", "医師に頼め", "無駄な事をするな", "信神第一", "異変あれば急げ", "日頃の行いによりけり"
        ];
        return this.selectRandomItem(diseaseList);
    }
}

export default new OmikujiCommand();
