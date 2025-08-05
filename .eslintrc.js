export default [
    { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended, // стандартные правила для JavaScript
    ...tseslint.configs.recommended, // стандартные правила для TypeScript
    ...pluginVue.configs['flat/essential'], // стандартные правила для Vue
    {
        files: ['**/*.vue'],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    }, // указывает, что в .vue файлах должен использоваться TypeScript-парсер
    stylistic.configs['disable-legacy'], // отключает устаревшие правила
    stylistic.configs.customize({
        blockSpacing: true, // пробелы внутри блоков
        braceStyle: '1tbs', // стиль фигурных скобок: открывающая скобка ставится на той же строке, закрывающая скобка — на новой строке
        commaDangle: 'never', // без запятой в конце
        indent: 2, // отступы — 2 пробела
        quotes: 'single', // кавычки '
    }),
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // разрешено использовать any
            '@typescript-eslint/no-empty-object-type': 'off', // разрешены пустые интерфейсы
            '@typescript-eslint/no-unused-vars': [
                'error', // выводить ошибку при неиспользуемых переменных
                {
                    args: 'all',
                    argsIgnorePattern: '^_', // разрешать переменные, начинающиеся с _, как преднамеренно неиспользуемые переменные
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
]
