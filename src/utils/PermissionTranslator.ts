import { PermissionsBitField } from 'discord.js';

/**
 * Discord APIの権限名（英語）とBigIntフラグのマッピング
 * PermissionsBitField.Flags を利用して、手動での定義を不要にし、正確性を担保します。
 */
const flags = PermissionsBitField.Flags;

/**
 * 権限名（英語キー）と日本語名のマッピング
 */
const names: Record<string, string> = {
    createInstantInvite: 'インスタント招待の作成',
    kickMembers: 'メンバーのキック',
    banMembers: 'メンバーのBAN',
    administrator: '管理者',
    manageChannels: 'チャンネルの管理',
    manageGuild: 'サーバーの管理',
    addReactions: 'リアクションの追加',
    viewAuditLog: '監査ログの閲覧',
    prioritySpeaker: '優先スピーカー',
    stream: 'ストリーム',
    viewChannel: 'チャンネルの閲覧',
    sendMessages: 'メッセージの送信',
    sendTTSMessages: 'TTSメッセージの送信',
    manageMessages: 'メッセージの管理',
    embedLinks: 'リンクの埋め込み',
    attachFiles: 'ファイルの添付',
    readMessageHistory: 'メッセージ履歴の閲覧',
    mentionEveryone: 'everyoneのメンション',
    useExternalEmojis: '外部の絵文字の使用',
    viewGuildInsights: 'サーバーのインサイトの閲覧',
    connect: '接続',
    speak: '発言',
    muteMembers: 'メンバーのミュート',
    deafenMembers: 'メンバーのスピーカーミュート',
    moveMembers: 'メンバーの移動',
    useVAD: '音声アクティビティの使用',
    changeNickname: 'ニックネームの変更',
    manageNicknames: 'ニックネームの管理',
    manageRoles: 'ロールの管理',
    manageWebhooks: 'Webhookの管理',
    manageGuildExpressions: '絵文字とステッカーの管理',
    useApplicationCommands: 'アプリケーションコマンドの使用',
    requestToSpeak: '発言のリクエスト',
    manageThreads: 'スレッドの管理',
    usePublicThreads: '公開スレッドの使用',
    usePrivateThreads: 'プライベートスレッドの使用',
    useExternalStickers: '外部のステッカーの使用',
    sendMessagesInThreads: 'スレッドでのメッセージ送信',
    useEmbeddedActivities: '埋め込みアクティビティの開始',
    moderateMembers: 'メンバーのモデレーション',
    viewCreatorMonetizationAnalytics: 'クリエイター収益アナリティクスの表示',
    useSoundboard: 'サウンドボードの使用',
    useExternalSounds: '外部のサウンドを使用',
    sendVoiceMessages: 'ボイスメッセージを送信'
};

/**
 * 権限ビットフィールドを日本語の権限名配列に変換します。
 * @param bitfield 変換したい権限ビットフィールド
 * @returns 権限名の配列
 */
export function translatePermission(bitfield: bigint | undefined): string[] {
    if (!bitfield) {
        return [];
    }

    // 「管理者」権限は全ての権限を包含するため、特別扱いする
    if ((bitfield & flags.Administrator) === flags.Administrator) {
        return [`${names.administrator} (すべての権限)`];
    }

    const resolved: string[] = [];
    for (const key in flags) {
        const permissionKey = key as keyof typeof flags;
        const flag = flags[permissionKey];

        if ((bitfield & flag) === flag) {
            resolved.push(names[permissionKey]);
        }
    }
    return resolved;
}
