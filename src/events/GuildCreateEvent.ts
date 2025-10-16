import { Guild } from 'discord.js';

import { EmbedFactory } from '../factories/EmbedFactory.js';
import { config } from '../utils/config.js';
import { dateTimeFormatter } from '../utils/dateTimeFormatter.js';
import { EventBase } from './base/event_base.js';
import { logger } from '../utils/log.js';

class GuildCreateEvent extends EventBase<'guildCreate'> {
    public eventName = 'guildCreate' as const;
    private embedFactory = new EmbedFactory();

    public async listener(guild: Guild): Promise<void> {
        try {
            const name = `名前(ID): ${guild.name} (${guild.id})`;
            const owner = await guild.fetchOwner();
            const ownerInfo = `所有者(ID): ${owner.user.username} (${owner.user.id})`;
            const description = guild.description ? `説明: ${guild.description}` : '説明: なし';
            const memberCount = `メンバー数: ${String(guild.memberCount)}`;
            const createdAt = `作成日時: ${dateTimeFormatter(guild.createdAt)}`;

            const basicInfo = [name, ownerInfo, description, createdAt, memberCount].join('\n');

            const iconURL = guild.iconURL() ?? null;

            const guildAddCount = String(guild.client.guilds.cache.size);

            const embed = this.embedFactory
                .createSystemEmbed()
                .setTitle('BOT導入通知')
                .setFields({ name: '基本情報', value: basicInfo }, { name: '導入サーバー数', value: guildAddCount })
                .setThumbnail(iconURL);

            const channel = guild.client.channels.cache.get(config.botEntranceChannelId);
            if (channel?.isTextBased() && 'send' in channel) {
                await channel.send({ embeds: [embed] });
            }
        } catch (error) {
            logger.error('Error in GuildCreateEvent listener:', error);
        }
    }
}

export default new GuildCreateEvent();
