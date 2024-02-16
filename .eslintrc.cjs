module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',"plugin:@typescript-eslint/recommended", "prettier",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh',"@typescript-eslint"]	,
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],"@typescript-eslint/no-unused-vars": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0
  },
  
}
