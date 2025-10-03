import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, User } from 'discord.js';

import { EmbedFactory } from '../../../factories/EmbedFactory.js';
import { dateTimeFormatter } from '../../../utils/dateTimeFormatter.js';
import { PermissionTranslator } from '../../../utils/PermissionTranslator.js';
import { statusAddEmoji } from '../../../utils/statusEmojiAdd.js';

class UserEmbed {
    private readonly embedFactory = new EmbedFactory();

    /**
     * ユーザー情報（サーバー参加日、ロール、権限など）を含んだEmbedを作成します。
     * @param user 表示対象のユーザーオブジェクト
     * @param member 表示対象のギルドメンバーオブジェクト
     * @param interaction コマンドのインタラクションオブジェクト（ギルド情報の参照に使用）
     * @returns ユーザー情報が設定されたEmbedBuilderインスタンス
     */
    public create(user: User, member: GuildMember, interaction: ChatInputCommandInteraction): EmbedBuilder {
        const roles =
            member.roles.cache
                .filter((role) => role.id !== interaction.guild?.id)
                .map((role) => role.toString())
                .join(', ') || 'なし';

        const permissionBitfield = member.permissions.bitfield;
        const permissions = new PermissionTranslator(permissionBitfield).permissionNames;

        const userName = `ユーザー名(ID): ${user.username} (${user.id})`;
        const userGlobalName = `表示名: ${user.globalName ?? 'なし'}`;
        const userStatus = statusAddEmoji(member.presence?.status ?? 'offline');
        const accountCreationDate = `アカウント作成日: ${dateTimeFormatter(user.createdAt)}`;
        const guildJoinDate = `サーバー参加日: ${member.joinedAt ? dateTimeFormatter(member.joinedAt) : '不明'}`;
        const memberNickname = `ニックネーム: ${member.nickname ?? 'なし'}`;
        const memberPermissions = permissions.length > 0 ? permissions.map((name) => `\`${name}\``).join(', ') : 'なし';

        const basicInfo = [userName, userGlobalName, userStatus, accountCreationDate].join('\n');
        const memberInfo = [memberNickname, guildJoinDate].join('\n');

        const embed = this.embedFactory
            .createBaseEmbed(interaction.user)
            .setTitle(`ユーザー情報`)
            .setFields(
                { name: '基本情報', value: basicInfo },
                { name: 'メンバー情報', value: memberInfo },
                { name: `役職 (${String(member.roles.cache.size - 1)})`, value: roles },
                { name: `権限 (${String(permissionBitfield)})`, value: memberPermissions }
            )
            .setThumbnail(user.displayAvatarURL());
        return embed;
    }
}

export default new UserEmbed();
