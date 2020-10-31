/**
 * @license MIT
 */
/**
 * @fileoverview
 * This file will resolve node modules for scripts in the dev directory and
 * leave us with scripts in dist/ that are ready for Closure Compiler.
 */

import glob from 'glob';
import { DIST_PLUGINS } from './plugins.js';
import { DIST_EXTERNS } from './externs.js';

console.log('DIST:ES');

const devEsModules = glob.sync('dev/*.mjs');
const preformattedExes = glob.sync('dev/exe.*');

const distEs = [
  ...devEsModules,
  // ...preformattedExes,
];

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
