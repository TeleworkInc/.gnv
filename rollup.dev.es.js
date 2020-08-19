/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup ES dev config. Special considerations are added, such as named exports
 * as default and `import.meta.url` resolution.
 */

import glob from 'glob';
import exportDefault from 'rollup-plugin-export-default';
import { defaultPlugins } from './rollup.plugins.js';
import { devExternal } from './rollup.externals.js';
import importMetaUrl from 'rollup-plugin-import-meta-url';

const exportESM = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dev')
        .replace('.js', '.mjs'),
    format: 'esm',
    // will help with compiler inlining
    preferConst: true,
  },
  plugins: [
    ...defaultPlugins,
    /**
     * Handle `import.meta.url` in dev ESM output. Resolve it the static
     * absolute path of the source file.
     */
    importMetaUrl(),
    /**
     * Export named exports as default if no default export defined.
     */
    exportDefault(),
  ],
  external: devExternal,
});

const exportCJS = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dev')
        .replace('.js', '.cjs'),
    format: 'cjs',
    preferConst: true,
  },
  plugins: defaultPlugins,
  external: devExternal,
});

export default [
  /**
   * Compile ESM builds for everything in the exports/ directory.
   */
  ...glob.sync('exports/*.js').map(exportESM),
  /**
   * Use Rollup to roll the universal CJS bundle since it will contain no Node
   * dependencies by definition.
   */
  exportCJS('exports/universal.js'),
];
