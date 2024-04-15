module.exports = {
  root: true,
  extends: ['@react-native-community'],
  plugins: ['react', 'import'],
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ], // Disable the linebreak-style rule
  },
};
// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//     node: true,
//   },
//   extends: ['eslint:recommended', 'plugin:react/recommended'],
//   overrides: [
//     {
//       env: {
//         node: true,
//       },
//       files: ['.eslintrc.{js,cjs}'],
//       parserOptions: {
//         sourceType: 'script',
//       },
//     },
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   settings: {
//     'import/resolver': {
//       node: {
//         paths: ['src'], // This will allow imports from the 'src' directory
//         extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add any file extensions you're using
//         moduleDirectory: ['node_modules', 'src'], // Tell ESLint to look in 'src' for imports
//       },
//     },
//   },
//   plugins: ['react', 'import'],
//   rules: {
//     'import/order': [
//       'error',
//       {
//         groups: [
//           'builtin',
//           'external',
//           'internal',
//           'parent',
//           'sibling',
//           'index',
//         ],
//         'newlines-between': 'always',
//         alphabetize: {
//           order: 'asc',
//           caseInsensitive: true,
//         },
//       },
//     ],
//     'import/newline-after-import': ['error', { count: 1 }],
//     'react/react-in-jsx-scope': 'error',
//     'react/jsx-no-undef': ['error', { allowGlobals: true }],
//     'import/no-unused-modules': 'warn',
//     'no-unused-vars': 'warn',
//     'import/no-unresolved': 'error',
//     'no-undef': 'warn',
//   },
// };

// module.exports = {
//   extends: ["@architecture-it/andreani/react"],
// };
