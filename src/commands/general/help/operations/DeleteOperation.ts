import { StringSelectMenuInteraction } from 'discord.js';

import { IOperationStrategy } from './IOperationStrategy.js';

class DeleteOperation implements IOperationStrategy {
    public async execute(interaction: StringSelectMenuInteraction): Promise<void> {
        await interaction.message.delete();
    }
}

export default DeleteOperation;
