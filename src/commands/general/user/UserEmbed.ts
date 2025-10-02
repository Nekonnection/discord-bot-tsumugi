import { ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { dateTimeFormatter } from '../../../utils/dateTimeFormatter.js';
import { PermissionTranslator } from '../../../utils/PermissionTranslator.js';
import { statusAddEmoji } from '../../../utils/statusEmojiAdd.js';

class UserEmbed {
    private readonly embedFactory = new EmbedFactory();

    /**
     * ユーザー情報（サーバー参加日、ロール、権限など）を含んだEmbedを作成します。
     * @param interaction コマンドのインタラクションオブジェクト
     * @returns ユーザー情報が設定されたEmbedBuilderインスタンス
     */
    public createUserInfoEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
        const user = interaction.user;
        const member = interaction.member as GuildMember;

        const roles = member.roles.cache
            .filter((role) => role.id !== interaction.guild?.id)
            .map((role) => role.toString())
            .join(', ');
        const permssionBitfield = member.permissions.bitfield;
        const permissions = new PermissionTranslator(permssionBitfield).permissionNames;
        const userName = `ユーザー名(ID): ${user.username}(${user.id})`;
        const userId = `表示名: ${user.globalName ?? 'なし'}`;
        const userStatus = statusAddEmoji(member.presence?.status ?? 'offline');
        const accountCreationDate = `アカウント作成日: ${dateTimeFormatter(user.createdAt)}`;
        const guildJoinDate = `サーバー参加日: ${member.joinedAt ? dateTimeFormatter(member.joinedAt) : '不明'}`;
        const memberNickname = `ニックネーム: ${member.nickname ?? 'なし'}`;
        const memberRoles = `ロール: ${roles || 'なし'}`;
        const memberPermissions = `権限(${String(permssionBitfield)}): \`\`\`${permissions.length > 0 ? permissions.join(', ') : 'なし'}\`\`\``;
        const basicInfo = [userName, userId, userStatus, accountCreationDate].join('\n');
        const memberInfo = [memberNickname, guildJoinDate, memberRoles, memberPermissions].join('\n');

        const embed = this.embedFactory
            .createBaseEmbed(user)
            .setTitle(`${user.username}の情報`)
            .setFields({ name: '基本情報', value: basicInfo }, { name: 'メンバー情報', value: memberInfo })
            .setThumbnail(user.displayAvatarURL());
        return embed;
    }
}

export default new UserEmbed();
