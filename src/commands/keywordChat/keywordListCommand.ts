import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

import { prisma } from '../../index.js';
import { SubCommandInteraction } from '../base/command_base.js';
import keywordCommandGroup from './keywordCommandGroup.js';
import keywordEmbed from './keywordEmbed.js';

class KeywordListCommand extends SubCommandInteraction {
    public command = new SlashCommandSubcommandBuilder().setName('list').setDescription('登録されているキーワードの一覧を表示します。');

    public constructor() {
        super(keywordCommandGroup);
    }

    /** @inheritdoc */
    public async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({ content: 'サーバー内でのみ実行できます。' });
            return;
        }

        await interaction.deferReply();

        const prismaKeywords = await prisma.keyword.findMany({
            where: {
                guildId: interaction.guild.id
            },
            orderBy: {
                trigger: 'asc'
            }
        });

        if (prismaKeywords.length === 0) {
            await interaction.editReply('このサーバーにはキーワードが登録されていません。');
            return;
        }

        const keywords = prismaKeywords.map((k) => ({
            id: k.id,
            guildId: k.guildId,
            trigger: k.trigger,
            responses: Array.isArray(k.responses)
                ? k.responses.filter((r): r is string => typeof r === 'string')
                : typeof k.responses === 'string'
                  ? k.responses
                  : ''
        }));

        const embeds = keywordEmbed.createKeywordListEmbeds(interaction.user, keywords);

        const firstEmbed = embeds.shift();
        if (firstEmbed) {
            await interaction.editReply({
                embeds: [firstEmbed]
            });
        }

        for (const embed of embeds) {
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
}

export default new KeywordListCommand();
