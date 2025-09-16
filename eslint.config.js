import eslintJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default [
    /**
     * 推奨される基本設定
     */
    eslintJs.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    /**
     * TypeScriptのカスタムルール
     */
    {
        languageOptions: {
            parserOptions: {
                project: true, // tsconfig.jsonを見つける
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // 未使用の引数や変数をエラーにする
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_', // 引数名が_で始まる場合は未使用でもエラーにしない
                    varsIgnorePattern: '^_', // 変数名が_で始まる場合は未使用でもエラーにしない
                    caughtErrorsIgnorePattern: '^_', // catchのエラー名が_で始まる場合は未使用でもエラーにしない
                },
            ],
            // public, privateなどのアクセス修飾子を必須にする
            '@typescript-eslint/explicit-member-accessibility': 'error',
            // 関数の戻り値の型指定を必須にする
            '@typescript-eslint/explicit-function-return-type': 'error',
            // 命名規則をサーバーサイド向けに簡略化
            '@typescript-eslint/naming-convention': [
                'error',
                // 基本はcamelCase
                {
                    selector: 'default',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                // 定数はUPPER_CASEを許可
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['camelCase', 'UPPER_CASE'],
                },
                // インポートはcamelCaseかPascalCase
                {
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
                // 型定義(class, interface, type, enum)はPascalCase
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
            ],
        },
    },

    /**
     * import関連のルール
     */
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
            import: importPlugin,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
        },
    },
    /**
     * 無視するファイル・ディレクトリ
     */
    {
        ignores: [
            'node_modules/',
            'dist/',
            '*.config.js',
            '*.config.ts',
            '.env',
        ],
    },
    /**
     * Prettierとの競合を避ける設定
     */
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
]