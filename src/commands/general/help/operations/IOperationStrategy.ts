import { StringSelectMenuInteraction } from 'discord.js';

export interface IOperationStrategy {
    execute(interaction: StringSelectMenuInteraction): Promise<void>;
}
