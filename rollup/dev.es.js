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

import { DEV_PLUGINS } from './plugins.js';
import { DEV_EXTERNS } from './externs.js';

const exportESM = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dev')
        .replace('.js', '.mjs'),
    format: 'esm',
    /** Will help with compiler inlining. */
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

const exportExe = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dev')
        .replace('.js', '.mjs'),
    format: 'esm',
    /** Will help with compiler inlining. */
    preferConst: true,
  },
  /** Plugins and externs. */
  plugins: DEV_PLUGINS,
  external: DEV_EXTERNS,
  /**
   * Do not tree-shake exes due to Rollup DCE logic eliminating JSDOC typedefs.
   */
  treeshake: false,
});

/**
 * All default exports in exports/ except executables.
 */
const devExports = glob.sync(
    'exports/*.js',
    { ignore: 'exports/exe.*' },
).map(exportESM);

/**
 * All exe.* files in exports/.
 */
const exeExports = glob.sync('exports/exe.*').map(exportExe);

/**
 * Write ESM bundles to dev/ for everything except the exe export.
 */
export default [
  ...devExports,
  ...exeExports,
];

