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
import importMetaUrl from 'rollup-plugin-import-meta-url';
import { DEV_PLUGINS } from './rollup.plugins.js';
import { DEV_EXTERNS } from './rollup.externs.js';

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
    ...DEV_PLUGINS,
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
  external: DEV_EXTERNS,
});

/**
 * Write ESM bundles to dev/ for everything except the exe export.
 */
export default (
  glob.sync(
      'exports/*.js',
      { ignore: 'exports/exe.*' },
  )
).map(exportESM);
