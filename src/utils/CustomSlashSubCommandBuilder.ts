import { SlashCommandSubcommandBuilder } from 'discord.js';

class CustomSlashSubcommandBuilder extends SlashCommandSubcommandBuilder {
    public category?: string;
    public usage?: string;
    public defaultBotPermissions?: string;

    public constructor() {
        super();
    }

    public setCategory(category: string): this {
        this.category = category;
        return this;
    }

    public setUsage(usage: string): this {
        this.usage = usage;
        return this;
    }

    public setDefaultBotPermissions(permissions: bigint | number | null | undefined): this {
        this.defaultBotPermissions = permissions?.toString();
        return this;
    }
}

export default CustomSlashSubcommandBuilder;
