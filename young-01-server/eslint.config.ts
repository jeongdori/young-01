import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    tseslint.configs.recommended,
    {
        ignores: ['dist', 'node_modules', 'src/generated', '**/*.d.ts'],
    },
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
            parser: tseslint.parser,
            sourceType: 'module',
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    {
        rules: {
            ...prettier.rules,
        },
    },
);
