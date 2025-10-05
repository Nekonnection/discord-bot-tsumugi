import { ChannelType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { config } from '../../../utils/config.js';
import { dateTimeFormatter } from '../../../utils/dateTimeFormatter.js';

class GuildEmbed {
    private readonly embedFactory = new EmbedFactory();
    private static readonly maxLength = 1000;

    public create(interaction: ChatInputCommandInteraction): EmbedBuilder {
        if (!interaction.guild) {
            return this.embedFactory.createBaseEmbed(interaction.user).setTitle('エラー').setDescription('サーバー情報の取得に失敗しました。');
        }

        const everyoneRole = interaction.guild.roles.everyone;

        const channelCounts = {
            total: 0,
            publicText: 0,
            lockedText: 0,
            publicVoice: 0,
            lockedVoice: 0,
            publicAnnouncement: 0,
            lockedAnnouncement: 0,
            publicStage: 0,
            lockedStage: 0,
            category: 0
        };

        interaction.guild.channels.cache.forEach((channel) => {
            channelCounts.total++;
            const isPublic = channel.permissionsFor(everyoneRole).has('ViewChannel');
            if (channel.type === ChannelType.GuildCategory) {
                channelCounts.category++;
                return;
            }
            if (channel.type === ChannelType.GuildText) {
                if (isPublic) channelCounts.publicText++;
                else channelCounts.lockedText++;
            } else if (channel.type === ChannelType.GuildVoice) {
                if (isPublic) channelCounts.publicVoice++;
                else channelCounts.lockedVoice++;
            } else if (channel.type === ChannelType.GuildAnnouncement) {
                if (isPublic) channelCounts.publicAnnouncement++;
                else channelCounts.lockedAnnouncement++;
            } else if (channel.type === ChannelType.GuildStageVoice) {
                if (isPublic) channelCounts.publicStage++;
                else channelCounts.lockedStage++;
            }
        });

        const name = `名前(ID): ${interaction.guild.name} (${interaction.guild.id})`;
        const description = `説明: ${interaction.guild.description ?? 'なし'}`;
        const iconUrl = interaction.guild.iconURL();
        const ownerId = interaction.guild.ownerId;
        const owner = `所有者(ID): <@${ownerId}> (${ownerId})`;
        const createAt = `作成日時: ${dateTimeFormatter(interaction.guild.joinedAt)}`;

        const basicInfo = [name, owner, description, createAt].join('\n');

        const emoji = config.channelEmoji;
        const channelTotalCount = `チャンネル数: ${String(channelCounts.total)}`;

        const channelDetails: string[] = [];
        if (channelCounts.category > 0) channelDetails.push(`${emoji.category} ${String(channelCounts.category)}`);
        if (channelCounts.publicText > 0) channelDetails.push(`${emoji.publicText} ${String(channelCounts.publicText)}`);
        if (channelCounts.lockedText > 0) channelDetails.push(`${emoji.lockedText} ${String(channelCounts.lockedText)}`);
        if (channelCounts.publicVoice > 0) channelDetails.push(`${emoji.publicVoice} ${String(channelCounts.publicVoice)}`);
        if (channelCounts.lockedVoice > 0) channelDetails.push(`${emoji.lockedVoice} ${String(channelCounts.lockedVoice)}`);
        if (channelCounts.publicAnnouncement > 0) channelDetails.push(`${emoji.publicAnnouncement} ${String(channelCounts.publicAnnouncement)}`);
        if (channelCounts.lockedAnnouncement > 0) channelDetails.push(`${emoji.lockedAnnouncement} ${String(channelCounts.lockedAnnouncement)}`);
        if (channelCounts.publicStage > 0) channelDetails.push(`${emoji.publicStage} ${String(channelCounts.publicStage)}`);
        if (channelCounts.lockedStage > 0) channelDetails.push(`${emoji.lockedStage} ${String(channelCounts.lockedStage)}`);

        const channelCountInfo = channelDetails.join(', ');
        const channelCountInfoLine = `${channelTotalCount} (${channelCountInfo})`;

        const memberTotalCount = String(interaction.guild.memberCount);
        const memberCount = `${config.memberEmoji}: ${String(interaction.guild.members.cache.filter((member) => !member.user.bot).size)}`;
        const botCount = `${config.botEmoji}: ${String(interaction.guild.members.cache.filter((member) => member.user.bot).size)}`;
        const memberInfo = `メンバー数: ${memberTotalCount} (${memberCount}, ${botCount})`;

        const boostCount = interaction.guild.premiumSubscriptionCount ?? 0;
        const boostInfo =
            boostCount > 0 ? `ブースト数: ${String(boostCount)} (ブーストレベル: ${String(interaction.guild.premiumTier)})` : `ブースト数: 0`;

        const emojiTotalCount = String(interaction.guild.emojis.cache.size);
        const emojiCount = String(interaction.guild.emojis.cache.filter((e) => !e.animated).size);
        const animatedEmojiCount = String(interaction.guild.emojis.cache.filter((e) => e.animated).size);
        const emojiInfo = `絵文字数: ${emojiTotalCount} (${config.emoji}: ${emojiCount}, ${config.gifEmoji}: ${animatedEmojiCount})`;

        const stickerCount = `スタンプ数: ${String(interaction.guild.stickers.cache.size)}`;

        const soundBoardCount = `サウンドボード数: ${String(interaction.guild.soundboardSounds.cache.size)}`;

        const roleMentionList = interaction.guild.roles.cache
            .filter((role) => role.id !== interaction.guild?.id)
            .sort((a, b) => b.position - a.position)
            .map((role) => `<@&${role.id}>`);

        let roles: string;
        if (roleMentionList.length === 0) {
            roles = 'なし';
        } else {
            let rolesString = '';
            let processedCount = 0;

            for (const roleMention of roleMentionList) {
                const separator = rolesString.length > 0 ? ', ' : '';
                const placeholderEllipsis = `, ...他${String(roleMentionList.length)}件`;

                if (rolesString.length + separator.length + roleMention.length + placeholderEllipsis.length > GuildEmbed.maxLength) {
                    break;
                }

                rolesString += separator + roleMention;
                processedCount++;
            }

            if (processedCount < roleMentionList.length) {
                const remainingCount = roleMentionList.length - processedCount;
                rolesString += `, ...他${String(remainingCount)}件`;
            }
            roles = rolesString;
        }

        const statsInfo = [memberInfo, boostInfo, channelCountInfoLine, emojiInfo, stickerCount, soundBoardCount].join('\n');

        const embed = this.embedFactory
            .createBaseEmbed(interaction.user)
            .setTitle('サーバー情報')
            .setFields(
                { name: '基本情報', value: basicInfo, inline: true },
                { name: '統計情報', value: statsInfo, inline: true },
                { name: `役職 (${String(interaction.guild.roles.cache.size - 1)})`, value: roles }
            )
            .setThumbnail(iconUrl);

        return embed;
    }
}

export default new GuildEmbed();
