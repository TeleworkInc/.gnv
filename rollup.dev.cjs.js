/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup CJS dev config.
 */

import glob from 'glob';
import { DEV_PLUGINS } from './rollup.plugins.js';
import { DEV_EXTERNS } from './rollup.externs.js';

export default (
  glob.sync(
      'dev/*.mjs',
      { ignore: 'exe.*' },
  ).map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
      exports: 'named',
    },
    plugins: DEV_PLUGINS,
    external: DEV_EXTERNS,
  }))
);
