import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

import { EmbedFactory } from '../../factories/EmbedFactory.js';
import { prisma } from '../../index.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordCommandGroup from './keywordCommandGroup.js';

class KeywordListCommand extends SubCommandInteraction {
    public command = new SlashCommandSubcommandBuilder().setName('list').setDescription('登録されているキーワードの一覧を表示します。');
    private embedFactory = new EmbedFactory();
    public constructor() {
        super(keywordCommandGroup);
    }

    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({ content: 'サーバー内でのみ実行できます。', ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const keywords = await prisma.keyword.findMany({
            where: {
                guildId: interaction.guild.id
            },
            orderBy: {
                trigger: 'asc'
            }
        });

        if (keywords.length === 0) {
            await interaction.editReply('このサーバーにはキーワードが登録されていません。');
            return;
        }

        let description = '';
        for (const keyword of keywords) {
            let responsesText: string;
            if (Array.isArray(keyword.responses)) {
                responsesText = keyword.responses.join(', ');
            } else if (typeof keyword.responses === 'string') {
                responsesText = keyword.responses;
            } else {
                responsesText = '';
            }
            const fieldText = `**${keyword.trigger}** -> ${responsesText}\n`;
            if ((description + fieldText).length > 4096) {
                description = 'あ';
                const embed = this.embedFactory.createBaseEmbed(interaction.user).setDescription(description);

                await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
            description += fieldText;
        }
        const embed = this.embedFactory.createBaseEmbed(interaction.user).setDescription(description);

        await interaction.editReply({
            embeds: [embed]
        });
    }
}

export default new KeywordListCommand();
