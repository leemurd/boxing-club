// import pluginVue from 'eslint-plugin-vue'
// import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// import pluginVitest from '@vitest/eslint-plugin'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
//
// // To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// // import { configureVueProject } from '@vue/eslint-config-typescript'
// // configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// // More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup
//
// export default defineConfigWithVueTs(
//   {
//     name: 'app/files-to-lint',
//     files: ['**/*.{ts,mts,tsx,vue}'],
//   },
//
//   {
//     name: 'app/files-to-ignore',
//     ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
//   },
//
//   pluginVue.configs['flat/essential'],
//   vueTsConfigs.recommended,
//
//   {
//     ...pluginVitest.configs.recommended,
//     files: ['src/**/__tests__/*'],
//   },
//   skipFormatting,
// )

// eslint.config.mjs
// import pluginVue from 'eslint-plugin-vue';
// import {
//   defineConfigWithVueTs,
//   vueTsConfigs,
//   configureVueProject
// } from '@vue/eslint-config-typescript';
//
// configureVueProject({
//   tsSyntaxInTemplates: true,
//   scriptLangs: [
//     'ts',
//     'js',
//     'tsx',
//     'jsx'
//   ],
//   rootDir: import.meta.dirname
// });
//
// export default defineConfigWithVueTs(
//   pluginVue.configs['flat/recommended'],
//   // vueTsConfigs.base
//   vueTsConfigs.recommended
// );


// eslint.config.ts

// Импорт необходимых модулей и плагинов ESLint
import js from '@eslint/js';
import globals from 'globals';
import vuePlugin from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
// import eslintConfigPrettier from 'eslint-config-prettier';
import eslintConfigPrettier from '@vue/eslint-config-prettier';

export default [
  // Глобальные настройки: окружение и игнорируемые файлы
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    ignores: ['dist', 'node_modules'],
  },

  // Настройки для файлов TypeScript/JavaScript
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // для правил, требующих информацию о типах
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      // Рекомендованные правила ESLint и TypeScript
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
      // Отключаем дублирующие правила, которые TypeScript берет на себя
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Дополнительные правила для строгой типизации
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Настройки для файлов Vue (*.vue)
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'vue': vuePlugin,
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      // Рекомендованные правила для Vue 3 и TypeScript
      ...vuePlugin.configs['flat/recommended'],
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
      // Кастомные правила проекта (если были в .eslintrc.cjs)
      'vue/multi-word-component-names': 'off',
    },
  },

  // Интеграция Prettier: отключаем конфликтующие правила и включаем форматирование
  eslintConfigPrettier, // отключает все правила, конфликтующие с Prettier
  {
    plugins: {
      'prettier': prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // вывод ошибок для несформатированного кода
    },
  },
];
