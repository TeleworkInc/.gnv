/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup CJS dev config.
 */

import glob from 'glob';
import { DEV_PLUGINS } from './plugins.js';
import { DEV_EXTERNS } from './externs.js';

export default (
  glob.sync(
      'dev/*.mjs',
      /**
       * Do not transpile executables, as they will output to ES5.
       */
      { ignore: 'dev/exe.*' },
  ).map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
      exports: 'named',
    },
    /** Plugins and externs. */
    plugins: DEV_PLUGINS,
    external: DEV_EXTERNS,
  }))
);
