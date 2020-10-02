/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup CJS dist config.
 */

import glob from 'glob';
import { DIST_PLUGINS } from './plugins.js';
import { DIST_EXTERNS } from './externs.js';

const distCjs = glob.sync(
    'dist/*.mjs',
    {
      ignore: [
        'universal.*',
        'exe.*',
      ],
    },
);

export default [
  ...distCjs.map((file) => ({
    input: file,
    output: {
      file: file.replace('mjs', 'cjs'),
      format: 'cjs',
      exports: 'named',
    },
    plugins: DIST_PLUGINS,
    external: DIST_EXTERNS,
  })),
];
