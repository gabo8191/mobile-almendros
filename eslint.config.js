// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'coverage/*', '**/__tests__/**/*.snap'],
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.{test,spec}.{ts,tsx,js,jsx}'],
    plugins: {
      'testing-library': require('eslint-plugin-testing-library'),
      jest: require('eslint-plugin-jest'),
    },
    extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
    env: {
      'jest/globals': true,
    },
    rules: {
      // Testing Library rules
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'error',

      // Jest rules
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',

      // Permitir console.log en tests para debugging
      'no-console': 'off',
    },
  },
]);
