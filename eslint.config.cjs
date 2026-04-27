const js = require('@eslint/js');
const css = require('@eslint/css').default;
const html = require('@html-eslint/eslint-plugin');
const htmlParser = require('@html-eslint/parser');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        document: 'readonly',
        Event: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLElement: 'readonly',
        navigator: 'readonly',
        Node: 'readonly',
        URL: 'readonly',
        window: 'readonly',
      },
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@html-eslint': html,
    },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      '@html-eslint/no-duplicate-attrs': 'error',
      '@html-eslint/no-duplicate-id': 'error',
      '@html-eslint/no-obsolete-attrs': 'error',
      '@html-eslint/no-obsolete-tags': 'error',
      '@html-eslint/require-doctype': 'error',
      '@html-eslint/require-img-alt': 'error',
      '@html-eslint/require-lang': 'error',
      '@html-eslint/require-meta-charset': 'error',
      '@html-eslint/require-title': 'error',
    },
  },
  {
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    rules: {
      'css/no-duplicate-imports': 'error',
      'css/no-empty-blocks': 'error',
      'css/no-invalid-at-rules': 'error',
      'css/no-invalid-properties': 'off',
    },
  },
  eslintConfigPrettier,
];
