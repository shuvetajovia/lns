import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import unused from 'eslint-plugin-unused-imports';
import hooks from 'eslint-plugin-react-hooks';
export default [
  { ignores: ['**/node_modules/**','**/dist/**','test-results/**','admin-portal/update_app.js'] },
  js.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,jsx}'], languageOptions: { globals: { ...globals.browser,...globals.node }, parserOptions: { ecmaFeatures: { jsx:true } } },
    plugins: { react, 'react-hooks':hooks, 'unused-imports':unused }, settings: { react: { version:'detect' } },
    rules: { 'unused-imports/no-unused-imports':'error','react/jsx-uses-react':'error','react/jsx-uses-vars':'error', 'react-hooks/rules-of-hooks':'error',
      'no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}], 'no-empty':['error',{allowEmptyCatch:true}] } }
];
