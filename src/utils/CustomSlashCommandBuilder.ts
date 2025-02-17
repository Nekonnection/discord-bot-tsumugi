import { SlashCommandBuilder } from 'discord.js';

class CustomSlashCommandBuilder extends SlashCommandBuilder {
    category?: string;
    usage?: string;
    default_bot_permissions: string | undefined;

    constructor() {
        super();
    }

    setCategory(category: string): this {
        this.category = category;
        return this;
    }

    setUsage(usage: string) {
        this.usage = usage;
        return this;
    }
    setDefaultBotPermissions(permissions: bigint | number | null | undefined): this {
        this.default_bot_permissions = permissions?.toString();
        return this;
    }
}

export default CustomSlashCommandBuilder;
