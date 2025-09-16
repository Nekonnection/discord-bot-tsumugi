import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { config } from '../../../utils/config.js';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { CommandInteraction } from '../../base/command_base.js';

/**
 * おみくじコマンド
 */
class OmikujiCommand extends CommandInteraction {
    public command = new CustomSlashCommandBuilder()
        .setName('omikuji')
        .setDescription('おみくじが引けます')
        .setCategory('お遊び系')
        .setUsage('`/omikuji`');

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();
        const embed = this.createEmbed(interaction);
        await interaction.editReply({
            embeds: [embed]
        });
    }
    /**
     * 埋め込みメッセージを作成する
     * @param interaction インタラクション
     * @returns 埋め込みメッセージ
     */
    private createEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        const omikuji = this.createOmikuji();
        return new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}さんのおみくじの結果`)
            .setDescription(omikuji)
            .setColor(Number(config.botColor))
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined });
    }
    /**
     * おみくじを作成する
     * @returns おみくじの結果
     */
    private createOmikuji(): string {
        const fortune = this.selectFortune();
        const hope = this.selectHope();
        const lostItem = this.selectLostItem();
        const learning = this.selectLearning();
        const conflict = this.selectConflict();
        const love = this.selectLove();
        const disease = this.selectDisease();

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
     * 運勢を選択する
     * @returns 運勢
     */
    private selectFortune(): string {
        const fortuneList = [
            { fortune: '大吉', probability: 20 },
            { fortune: '中吉', probability: 15 },
            { fortune: '小吉', probability: 15 },
            { fortune: '吉', probability: 20 },
            { fortune: '末吉', probability: 20 },
            { fortune: '凶', probability: 8 },
            { fortune: '大凶', probability: 2 }
        ];

        const totalProbability = fortuneList.reduce((acc, item) => acc + item.probability, 0);
        let random = Math.floor(Math.random() * totalProbability);

        const selectedFortune = fortuneList.find((item) => {
            if (random < item.probability) {
                return true;
            }
            random -= item.probability;
            return false;
        });

        return selectedFortune ? selectedFortune.fortune : '大吉';
    }
    /**
     * リストからランダムなアイテムを選択する
     * @param list アイテムのリスト
     * @returns ランダムに選ばれたアイテム
     */
    private selectRandomItem(list: string[]): string {
        return list[Math.floor(Math.random() * list.length)];
    }

    /**
     * 願望を選択する
     * @returns 願望
     */
    private selectHope(): string {
        const hopeList = ['叶う', '全力で願え', '日頃の行いによりけり', '良い事を沢山せよ 叶う', '叶うであろう だが油断禁物。', '叶わない事ありけり'];
        return this.selectRandomItem(hopeList);
    }

    /**
     * 失物を選択する
     * @returns 失物
     */
    private selectLostItem(): string {
        const lostItemList = [
            '出る',
            '出るであろう 下',
            '出るであろう 上',
            '出るであろう 周りを見よ',
            '出るであろう 横',
            '出るであろう 隙間',
            '日頃の行いによりけり',
            '出にくい'
        ];
        return this.selectRandomItem(lostItemList);
    }

    /**
     * 学問を選択する
     * @returns 学問
     */
    private selectLearning(): string {
        const learningList = ['安心して勉学せよ', '勉学すればよろし', '勉学を推奨する', '困難。勉学せよ', '全力を尽くせ', '自己の甘えを捨てよ'];
        return this.selectRandomItem(learningList);
    }

    /**
     * 争事を選択する
     * @returns 争事
     */
    private selectConflict(): string {
        const conflictList = [
            '勝てる 油断禁物',
            '勝てるであろう',
            '勝ちがたし',
            '勝ちがたし 控えよ',
            '勝ちがたし 時を待て',
            '困難 諦めよ',
            '全力を尽くせ',
            '自己の甘えを捨てよ'
        ];
        return this.selectRandomItem(conflictList);
    }

    /**
     * 恋愛を選択する
     * @returns 恋愛
     */
    private selectLove(): string {
        const loveList = ['この人を逃すな', '自分磨きをせよ', '感情を抑えよ', '見た目で選ぶな', '中身で選べ', '積極的になれ', '日頃の行いによりけり'];
        return this.selectRandomItem(loveList);
    }

    /**
     * 病気を選択する
     * @returns 病気
     */
    private selectDisease(): string {
        const diseaseList = [
            '信じろ なおる',
            '医者への信心第一',
            '医師に頼め',
            '無駄な事をするな',
            '信神第一',
            '異変あれば急げ',
            '日頃の行いによりけり'
        ];
        return this.selectRandomItem(diseaseList);
    }
}

export default new OmikujiCommand();
