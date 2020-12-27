/** @license MIT */
/**
 * @fileoverview
 * This compiles the dev build of the exe, which does not aim to transpile any
 * syntax, but only remove dead code and run a light DCE pass over the input.
 */

import glob from 'glob';

import { DEV_EXTERNS, DIST_EXTERNS } from './externs.js';
import { DEV_PLUGINS, DIST_PLUGINS, MAX_DCE_PLUGINS } from './plugins.js';

const exportExe = (file) => ({
  input: file,
  output: {
    file: file.replace('dev', 'dist'),
    format: 'esm',
    preferConst: true,
  },
  plugins: [
    ...DIST_PLUGINS,
    // ...MAX_DCE_PLUGINS(file),
  ],
  external: DIST_EXTERNS,
});

export default glob.sync('dev/exe.*').map(exportExe);
