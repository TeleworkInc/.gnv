/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup ES dist config.
 */

import glob from 'glob';
import { DIST_PLUGINS } from './plugins.js';
import { DIST_EXTERNS } from './externs.js';

const distEs = glob.sync(
    'dev/*.mjs',
    { ignore: 'dev/exe.*' },
);

export default [
  ...distEs.map(
      (file) => ({
        input: file,
        output: {
          file: file.replace('dev', 'dist'),
          format: 'esm',
          // will help with compiler inlining
          preferConst: true,
        },
        plugins: DIST_PLUGINS,
        external: DIST_EXTERNS,
      }),
  ),
];
