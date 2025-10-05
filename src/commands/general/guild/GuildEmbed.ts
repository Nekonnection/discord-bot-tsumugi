import { ChannelType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { config } from '../../../utils/config.js';
import { dateTimeFormatter } from '../../../utils/dateTimeFormatter.js';

class GuildEmbed {
    private readonly embedFactory = new EmbedFactory();
    private static readonly maxLength = 1000;

    public async create(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
        if (!interaction.guildId) {
            return this.embedFactory.createBaseEmbed(interaction.user).setTitle('エラー').setDescription('サーバー情報の取得に失敗しました。');
        }

        try {
            const guild = await interaction.client.guilds.fetch(interaction.guildId);

            const [channels, members, rolesCollection, emojis, stickers, soundboardSounds] = await Promise.all([
                guild.channels.fetch(),
                guild.members.fetch(),
                guild.roles.fetch(),
                guild.emojis.fetch(),
                guild.stickers.fetch(),
                guild.soundboardSounds.fetch()
            ]);

            const everyoneRole = guild.roles.everyone;

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

            channels.forEach((channel) => {
                if (!channel) return;
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

            const owner = await guild.fetchOwner();
            const name = `名前(ID): ${guild.name} (${guild.id})`;
            const description = `説明: ${guild.description ?? 'なし'}`;
            const iconUrl = guild.iconURL();
            const ownerInfo = `所有者(ID): ${owner.toString()} (${owner.id})`;
            const createAt = `作成日時: ${dateTimeFormatter(guild.createdAt)}`;
            const basicInfo = [name, ownerInfo, description, createAt].join('\n');

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

            const memberTotalCount = String(guild.memberCount);
            const memberCount = `${config.memberEmoji}: ${String(members.filter((member) => !member.user.bot).size)}`;
            const botCount = `${config.botEmoji}: ${String(members.filter((member) => member.user.bot).size)}`;
            const memberInfo = `メンバー数: ${memberTotalCount} (${memberCount}, ${botCount})`;

            const boostCount = guild.premiumSubscriptionCount ?? 0;
            const boostInfo = boostCount > 0 ? `ブースト数: ${String(boostCount)} (ブーストレベル: ${String(guild.premiumTier)})` : `ブースト数: 0`;

            const emojiTotalCount = String(emojis.size);
            const emojiCount = String(emojis.filter((e) => !e.animated).size);
            const animatedEmojiCount = String(emojis.filter((e) => e.animated).size);
            const emojiInfo = `絵文字数: ${emojiTotalCount} (${config.emoji}: ${emojiCount}, ${config.gifEmoji}: ${animatedEmojiCount})`;

            const stickerCount = `スタンプ数: ${String(stickers.size)}`;
            const soundBoardCount = `サウンドボード数: ${String(soundboardSounds.size)}`;

            const roleMentionList = rolesCollection
                .filter((role) => role.id !== guild.id)
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString());

            let rolesString: string;
            if (roleMentionList.length === 0) {
                rolesString = 'なし';
            } else {
                let currentString = '';
                let processedCount = 0;
                for (const roleMention of roleMentionList) {
                    const separator = currentString.length > 0 ? ', ' : '';
                    const remainingCount = roleMentionList.length - processedCount;
                    const placeholderEllipsis = `, ...他${String(remainingCount)}件`;

                    if (currentString.length + separator.length + roleMention.length + placeholderEllipsis.length > GuildEmbed.maxLength) {
                        break;
                    }
                    currentString += separator + roleMention;
                    processedCount++;
                }

                if (processedCount < roleMentionList.length) {
                    const remainingCount = roleMentionList.length - processedCount;
                    currentString += `, ...他${String(remainingCount)}件`;
                }
                rolesString = currentString;
            }

            const statsInfo = [memberInfo, boostInfo, channelCountInfoLine, emojiInfo, stickerCount, soundBoardCount].join('\n');

            const embed = this.embedFactory
                .createBaseEmbed(interaction.user)
                .setTitle('サーバー情報')
                .setFields(
                    { name: '基本情報', value: basicInfo, inline: true },
                    { name: '統計情報', value: statsInfo, inline: true },
                    { name: `役職 (${String(rolesCollection.size - 1)})`, value: rolesString }
                )
                .setThumbnail(iconUrl);

            return embed;
        } catch (error) {
            console.error('サーバー情報の取得中にエラーが発生しました:', error);
            return this.embedFactory.createBaseEmbed(interaction.user).setTitle('エラー').setDescription('サーバー情報の取得に失敗しました。');
        }
    }
}

export default new GuildEmbed();
