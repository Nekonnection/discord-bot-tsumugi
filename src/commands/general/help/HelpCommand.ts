import { ActionRowBuilder, AutocompleteInteraction, ChatInputCommandInteraction, StringSelectMenuBuilder } from 'discord.js';

import CommandService from '../../../services/CommandService.js';
import CustomSlashCommandBuilder from '../../../utils/CustomSlashCommandBuilder.js';
import { AutocompleteCommandInteraction } from '../../base/command_base.js';
import HelpCategoryMenuAction from './actions/HelpCategoryMenuAction.js';
import HelpOperationMenuAction from './actions/HelpOperationMenuAction.js';
import HelpEmbedFactory from './HelpEmbedFactory.js';

/**
 * Helpコマンド
 */
class HelpCommand extends AutocompleteCommandInteraction {
    public command = new CustomSlashCommandBuilder()
        .setName('help')
        .setDescription('Botのヘルプを表示します')
        .setCategory('一般')
        .setUsage('`/help`, `/help ping`')
        .addStringOption((option) =>
            option.setName('command_name').setDescription('指定したコマンドの詳細情報を表示します。').setAutocomplete(true)
        ) as CustomSlashCommandBuilder;

    protected async onAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption = interaction.options.getFocused(true);
        if (focusedOption.name !== 'command_name') return;

        const choices = CommandService.getCommandNames();
        const filteredChoices = choices.filter((choice) => choice.startsWith(focusedOption.value));
        const response = filteredChoices.map((choice) => ({ name: choice, value: choice }));

        await interaction.respond(response.slice(0, 25));
    }

    protected async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply();

        const commandName = interaction.options.getString('command_name');

        if (commandName) {
            const commandInfo = CommandService.findCommandName(commandName);
            const embed = commandInfo
                ? HelpEmbedFactory.createCommandInfoEmbed(interaction, commandInfo)
                : HelpEmbedFactory.createErrorEmbed(interaction, `コマンド \`${commandName}\` は見つかりませんでした。`);

            await interaction.editReply({ embeds: [embed] });
        } else {
            const categoryList = CommandService.getCommandsCategory();
            const embed = HelpEmbedFactory.createHomeEmbed(interaction, categoryList);

            const categoryMenu = await HelpCategoryMenuAction.create();
            const operationMenu = await HelpOperationMenuAction.create();
            const components = [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categoryMenu),
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(operationMenu)
            ];

            await interaction.editReply({ embeds: [embed], components });
        }
    }
}

export default new HelpCommand();
