import { StringSelectMenuInteraction } from 'discord.js';

import { IOperationStrategy } from './IOperationStrategy.js';

class FixationOperation implements IOperationStrategy {
    public async execute(interaction: StringSelectMenuInteraction): Promise<void> {
        await interaction.editReply({ components: [] });
    }
}

export default FixationOperation;
