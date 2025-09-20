import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction, PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';

import { prisma } from '../../index.js';
import CustomSlashCommandBuilder from '../../utils/CustomSlashCommandBuilder.js';
import { logger } from '../../utils/log.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordCommandGroup from './keywordCommandGroup.js';

/**
 * キーワード削除コマンド
 */
class KeywordRemoveCommand extends SubCommandInteraction {
    public command = new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('登録されているキーワードを削除します。')
        .addStringOption((option) => option.setName('keyword').setDescription('削除するキーワード').setRequired(true).setAutocomplete(true));

    public constructor() {
        super(keywordCommandGroup);
        if (this.command instanceof CustomSlashCommandBuilder) {
            this.command.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild);
        }
    }
    /** @inheritdoc */
    public override async onInteractionCreate(interaction: Interaction): Promise<void> {
        // 基底クラスの処理を呼び出しつつ、オートコンプリートにも対応
        void super.onInteractionCreate(interaction);

        if (
            interaction.isAutocomplete() &&
            interaction.commandName === this.command.name &&
            interaction.options.getSubcommand() === this.command.name
        ) {
            await this.onAutocomplete(interaction);
        }
    }
    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({ content: 'サーバー内でのみ実行できます。', ephemeral: true });
            return;
        }
        const trigger = interaction.options.getString('keyword', true);

        try {
            await prisma.keyword.delete({
                where: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    guildId_trigger: {
                        guildId: interaction.guild.id,
                        trigger: trigger
                    }
                }
            });
            await interaction.reply({ content: `キーワード「${trigger}」を削除しました。`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `キーワード「${trigger}」は見つかりませんでした。`, ephemeral: true });
            logger.error('キーワード削除エラー: ', error);
        }
    }
    /**
     * オートコンプリートの処理
     */
    protected async onAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (!interaction.guild) return;

        const focusedValue = interaction.options.getFocused();
        const keywords = await prisma.keyword.findMany({
            where: {
                guildId: interaction.guild.id,
                trigger: {
                    startsWith: focusedValue
                }
            },
            take: 25
        });

        await interaction.respond(keywords.map((kw) => ({ name: kw.trigger, value: kw.trigger })));
    }
}

export default new KeywordRemoveCommand();
