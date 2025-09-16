import { StringSelectMenuInteraction } from 'discord.js';

import HelpEmbedFactory from '../HelpEmbedFactory.js';
import { IOperationStrategy } from './IOperationStrategy.js';

class GuideOperation implements IOperationStrategy {
    public async execute(interaction: StringSelectMenuInteraction): Promise<void> {
        const guideEmbed = HelpEmbedFactory.createGuideEmbed(interaction);
        await interaction.editReply({ embeds: [guideEmbed] });
    }
}

export default GuideOperation;
