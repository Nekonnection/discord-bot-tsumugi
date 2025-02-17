/**
 * bigint型で渡された権限を日本語の配列に変換するクラス
 */
export class PermissionTranslator {
    private static permissionFlags: { [key: string]: bigint } = {
        インスタント招待の作成: 1n << 0n,
        メンバーのキック: 1n << 1n,
        メンバーのBAN: 1n << 2n,
        管理者: 1n << 3n,
        チャンネルの管理: 1n << 4n,
        サーバーの管理: 1n << 5n,
        リアクションの追加: 1n << 6n,
        監査ログの閲覧: 1n << 7n,
        優先スピーカー: 1n << 8n,
        ストリーム: 1n << 9n,
        チャンネルの閲覧: 1n << 10n,
        メッセージの送信: 1n << 11n,
        TTSメッセージの送信: 1n << 12n,
        メッセージの管理: 1n << 13n,
        リンクの埋め込み: 1n << 14n,
        ファイルの添付: 1n << 15n,
        メッセージ履歴の閲覧: 1n << 16n,
        everyoneのメンション: 1n << 17n,
        外部の絵文字の使用: 1n << 18n,
        サーバーのインサイトの閲覧: 1n << 19n,
        接続: 1n << 20n,
        発言: 1n << 21n,
        メンバーのミュート: 1n << 22n,
        メンバーのスピーカーミュート: 1n << 23n,
        メンバーの移動: 1n << 24n,
        音声アクティビティの使用: 1n << 25n,
        ニックネームの変更: 1n << 26n,
        ニックネームの管理: 1n << 27n,
        ロールの管理: 1n << 28n,
        Webhookの管理: 1n << 29n,
        絵文字とステッカーの管理: 1n << 30n,
        アプリケーションコマンドの使用: 1n << 31n,
        発言のリクエスト: 1n << 32n,
        スレッドの管理: 1n << 34n,
        公開スレッドの使用: 1n << 35n,
        プライベートスレッドの使用: 1n << 36n,
        外部のステッカーの使用: 1n << 37n,
        スレッドでのメッセージ送信: 1n << 38n,
        埋め込みアクティビティの開始: 1n << 39n,
        メンバーのモデレーション: 1n << 40n
    };

    private bitfield: bigint | undefined;
    public permissionNames: string[];

    constructor(bitfield: bigint | undefined) {
        this.bitfield = bitfield;
        this.permissionNames = this.bitfield !== undefined ? this.getPermissions() : [];
    }

    private getPermissions(): string[] {
        return Object.keys(PermissionTranslator.permissionFlags)
            .filter((flag) => this.bitfield! & PermissionTranslator.permissionFlags[flag])
            .map((flag) => flag);
    }
}
