import js from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin-ts';
import importPlugin from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{cjs,js,jsx,mjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic/ts': stylisticPlugin,
      'import-x': importPlugin,
      react: reactPlugin,
    },
    rules: {
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            orderImportKind: 'desc',
          },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],
          'newlines-between': 'always',
          pathGroups: [
            { pattern: 'next', group: 'builtin', position: 'after' },
            { pattern: 'next/**', group: 'builtin', position: 'after' },
            { pattern: 'react', group: 'builtin', position: 'after' },
            { pattern: '@wadiz/**', group: 'external', position: 'after' },
            { pattern: './**/*.*', group: 'unknown', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: [],
          warnOnUnassignedImports: true,
        },
      ],
      'no-unused-vars': 'off',
      'react/jsx-sort-props': ['error', { callbacksLast: true }],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['**/@types/', '*.d.ts', 'build/', 'node_modules/'],
  },
];
