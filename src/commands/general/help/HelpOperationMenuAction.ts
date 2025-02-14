import { ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';
import { MessageComponentActionInteraction } from '../../base/action_base';
import helpCommand from './HelpCommand';
import { config } from '../../../utils/config';

class HelpOperationMenuAction extends MessageComponentActionInteraction<ComponentType.StringSelect> {
    /**
     * セレクトメニューを作成
     * @returns 作成したビルダー
     */
    override async create(): Promise<StringSelectMenuBuilder> {
        const customId = this.createCustomId();
        return new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder('操作・その他')
            .addOptions([
                {
                    label: 'ホームに戻る',
                    value: 'home',
                    emoji: '<:bot_7:1033763464084193411>'
                },
                {
                    label: 'メニューを固定',
                    value: 'fixation',
                    emoji: '<:bot_8:1033764501142634717>'
                },
                {
                    label: 'メニューを削除',
                    value: 'delete',
                    emoji: '<:bot_9:1033764520302223441>'
                },
                {
                    label: 'コマンドの使用方法・今後について',
                    value: 'guide',
                    emoji: '<:bot_10:1033764549653962793>'
                }
            ]);
    }

    /**
     * コマンドが実行されたときに呼ばれる関数
     * @param interaction インタラクション
     */
    async onCommand(interaction: StringSelectMenuInteraction): Promise<void> {
        await interaction.deferUpdate();

        const commandsCategoryList = helpCommand.commandsCategoryList();
        switch (interaction.values[0]) {
            case 'home':
                const homeEmbed = await helpCommand.createHomeEmbed(interaction, await commandsCategoryList);
                await interaction.editReply({
                    embeds: [homeEmbed]
                });
                break;
            case 'fixation':
                await interaction.editReply({
                    components: []
                });
                break;
            case 'delete':
                await interaction.message.delete();
                break;
            case 'guide':
                const guideEmbed = await this.createGuideEmbed(interaction);
                await interaction.editReply({
                    embeds: [guideEmbed]
                });
                break;
        }
    }
    /**
     * 使い方の埋め込みメッセージを作成する関数
     * @param interaction インタラクション
     * @returns 使い方の埋め込みメッセージ
     */
    private async createGuideEmbed(interaction: StringSelectMenuInteraction): Promise<EmbedBuilder> {
        return new EmbedBuilder()
            .setAuthor({ name: '猫咲 紬 - ヘルプ', iconURL: config.iconURL })
            .setDescription('現在、スラッシュコマンドに移行中です。\n今後の更新でプレフィックスコマンドはサポートされなくなります。')
            .setFields({
                name: 'コマンドの使用方法',
                value: '`/[コマンド名]`で使用できます。\n例: `/ping`\n以前のプレフィックスコマンドを使用する場合、`t#help`を使用して確認してください。'
            })
            .setColor(Number(config.botColor))
            .setTimestamp()
            .setFooter({ text: `実行者: ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() || undefined });
    }
}

export default new HelpOperationMenuAction('help_operation', ComponentType.StringSelect);
