/** @license MIT */
/**
 * @fileoverview
 * This config will build a pre-compiled, single-file exe in dev/ to a final
 * output in dist/.
 */

import glob from 'glob';

import {
  DIST_EXTERNS,
} from './externs.js';

import {
  DEFAULT_PLUGINS,
  RESOLUTION_PLUGINS,
  MAX_DCE_PLUGINS,
} from './plugins.js';

import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
// import polyfills from 'rollup-plugin-node-polyfills';

const exportExe = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dist'),
    format: 'es',
    preferConst: true,
  },
  plugins: [
    builtins(),
    // globals(),
    // polyfills(),
    ...DEFAULT_PLUGINS,
    ...RESOLUTION_PLUGINS,
    ...MAX_DCE_PLUGINS,
  ],
  external: DIST_EXTERNS,
});

/**
 * Original source files.
 */
export default glob.sync('exports/exe.*').map(exportExe);
