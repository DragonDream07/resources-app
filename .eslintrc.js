'use strict';

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    // ── General ────────────────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],

    // ── Import ordering ────────────────────────────────────────────────
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',

    // ── Circular-dependency guard ───────────────────────────────────────
    // Prevents import cycles across the module graph.
    'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],

    // ── Module boundary rules ──────────────────────────────────────────
    // Modules must only import from their own layer or layers below them.
    // Allowed direction: routes -> controller -> service -> repository -> db/client
    // Cross-module imports must go through the public index (if present).
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            // Repositories must NOT import from service or controller layers.
            target: './src/db/repositories',
            from: './src/modules',
            message:
              'Repositories must not import from the modules layer. Dependency must flow downward: routes -> controller -> service -> repository.',
          },
          {
            // DB client must NOT import from any application layer.
            target: './src/db/client.js',
            from: './src/modules',
            message:
              'db/client must not import from the modules layer.',
          },
          {
            // Middleware must NOT import from modules (except config/utils).
            target: './src/middleware',
            from: './src/modules',
            message:
              'Middleware must not import from modules. Use config or utils instead.',
          },
        ],
      },
    ],

    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', 'jest.config.js'] },
    ],
  },
};
