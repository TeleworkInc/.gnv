/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup ES dev config.
 */

import glob from 'glob';
import exportDefault from 'rollup-plugin-export-default';
import { defaultPlugins } from './rollup.plugins.js';
import { devExternal } from './rollup.externals.js';

const exportESM = (file) => {
  return {
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
      ...defaultPlugins,
      exportDefault(),
    ],
    external: devExternal,
  };
};

const exportCJS = (file) => {
  return {
    input: file,
    output: {
      file: file
          .replace('exports', 'dev')
          .replace('.js', '.cjs'),
      format: 'cjs',
      preferConst: true,
    },
    plugins: defaultPlugins,
    external: devExternal,
  };
};

export default [
  /**
   * Compile ESM builds for everything in the exports/ directory.
   */
  ...glob.sync('exports/*.js').map(exportESM),
  /**
   * Use Rollup to roll the universal CJS bundle since it will contain no Node
   * dependencies by definition.
   */
  exportCJS('exports/universal.js'),
];
