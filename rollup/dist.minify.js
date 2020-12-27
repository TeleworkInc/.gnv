/**
 * @license MIT
 */
/**
 * @fileoverview
 * Rollup dist minification config.
 */

import { DIST_EXTERNS } from './externs.js';
import bundleSize from 'rollup-plugin-bundle-size';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import glob from 'glob';
import { MAX_DCE_PLUGINS, MIN_DCE_PLUGINS } from './plugins.js';

/**
 * Overwrite files in dist/.
 */
export default [
  ...glob.sync('dist/*').map(
      (file) => ({
        input: file,
        output: {
          file: file,
          preferConst: true,
        },
        /**
         * To minify, only Closure Compiler is needed. Bundle size plugin is
         * included for convenience.
         */
        plugins: [
          ...MIN_DCE_PLUGINS,
          // ...MAX_DCE_PLUGINS,
          // closureCompiler({
          //   /**
          //    * Simple minification, compile to ES5. This code can be compiled
          //    * with the BROWSER env since it should not conflict with browser
          //    * interfaces.
          //    */
          //   env: 'CUSTOM',
          //   compilation_level: 'SIMPLE',

          //   /**
          //    * Support the latest features, output ES5.
          //    */
          //   language_in: 'ES_NEXT',
          //   language_out: 'ECMASCRIPT5_STRICT',

          //   /**
          //    * Manually specify ES module assumptions.
          //    */
          //   assume_function_wrapper: true,
          //   strict_mode_input: true,

          //   /** Ignore all errors. */
          //   jscomp_off: '*',
          // }),
          bundleSize(),
        ],
        external: DIST_EXTERNS,
      }),
  ),
];

/**
 * Later, use ADVANCED with NodeJS externs via:
 */
// closureCompiler({
//   compilation_level: 'ADVANCED',
//   process_common_js_modules: true,
//   module_resolution: 'NODE',
//   js: 'node_modules',
//   externs: EXTERNS,
//   // jscomp_off: '*',
//   language_in: 'ES_NEXT',
//   language_out: 'NO_TRANSPILE',
// }),
