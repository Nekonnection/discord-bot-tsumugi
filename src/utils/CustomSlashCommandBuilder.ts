import { SlashCommandBuilder } from 'discord.js';

class CustomSlashCommandBuilder extends SlashCommandBuilder {
    public cooldown?: number;
    public category?: string;
    public usage?: string;
    public defaultBotPermissions?: string;

    public constructor() {
        super();
    }
    public setCoolDown(seconds: number): this {
        this.cooldown = seconds;
        return this;
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

export default CustomSlashCommandBuilder;
