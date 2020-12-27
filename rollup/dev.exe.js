/** @license MIT */
/**
 * @fileoverview
 * This compiles the dev build of the exe, which does not aim to transpile any
 * syntax, but only remove dead code and run a light DCE pass over the input.
 */

import glob from 'glob';

import { DEV_EXTERNS, DIST_EXTERNS } from './externs.js';
import { DEV_PLUGINS, DIST_PLUGINS, MAX_DCE_PLUGINS, RESOLUTION_PLUGINS } from './plugins.js';

const exportExe = (file) => ({
  input: file,
  output: {
    file: file
        .replace('exports', 'dev'),
    format: 'esm',
    preferConst: true,
  },
  plugins: DEV_PLUGINS,
  external: DEV_EXTERNS,
  /**
   * Do not tree-shake exes due to Rollup DCE logic eliminating JSDOC typedefs.
   */
  treeshake: false,
});

export default glob.sync('exports/exe.*').map(exportExe);
