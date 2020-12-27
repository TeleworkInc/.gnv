/**
 * @license MIT
 */
/**
 * @fileoverview
 * Plugins for generating dist/ output with Rollup.
 */

import bundleSize from 'rollup-plugin-bundle-size';
import classFieldsToGetters from 'rollup-plugin-class-fields-to-getters';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import commonjs from '@rollup/plugin-commonjs';
import disablePackages from 'rollup-plugin-disable-packages';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import shebang from 'rollup-plugin-preserve-shebang';

import { DISABLED_MODULES, DIST_EXTERNS } from './externs.js';
import { existsSync } from 'fs';

/**
 * Plugins that will always be used.
 */
export const DEFAULT_PLUGINS = [
  /**
   * Leave shebangs if present.
   */
  shebang(),
];

/**
 * Minimum DCE uses Closure Compiler's SIMPLE optimization and NO_TRANSPILE to
 * remove any obvious dead code without transpiling or inserting polyfills.
 */
export const MIN_DCE_PLUGINS = [
  closureCompiler({
    /** Do not worry about browser compliance. */
    env: 'CUSTOM',

    /** Minification and light dead code elimination. */
    compilation_level: 'SIMPLE',

    /**
     * Use most recent language features, no transpile.
     */
    language_in: 'ES_NEXT',
    language_out: 'NO_TRANSPILE',

    /** Suppress all optional errors. */
    jscomp_off: '*',
  }),
];

/**
 * Maximum DCE uses Closure Compiler's ADVANCED compilation mode with ESM
 * assumptions and type optimization enabled. Outputs ES5.
 *
 * @param {string} file
 * @return {Array}
 */
export const MAX_DCE_PLUGINS = [
  closureCompiler({
    /** Do not allow conflicts with browser interfaces. */
    env: 'CUSTOM',

    /**
     * Maximum compression, maximum logging.
     */
    compilation_level: 'ADVANCED',
    warning_level: 'QUIET',

    /**
     * Support all language features, and output ES5.
     */
    language_in: 'ES_NEXT',
    language_out: 'ECMASCRIPT5_STRICT',

    /**
     * CJS/ESM compatibility flags.
     */
    // js_module_root: [ '.', './node_modules' ],
    // process_common_js_modules: true,
    // module_resolution: 'NODE',
    // dependency_mode: 'PRUNE_LEGACY',

    /**
     * Compile to a type-optimized IIFE, and use type optimization.
     */
    isolation_mode: 'IIFE',
    use_types_for_optimization: true,

    /**
     * The following assumptions apply because gnv projects are always ES
     * modules.
     */
    assume_function_wrapper: true,
    // rewrite_polyfills: false,
    // inject_libraries: false,

    jscomp_off: [
      /**
       * Flags related to JSDoc tags.
       */
      'nonStandardJsDocs',
      'unknownDefines',

      /** Prevent JSC_UNDEFINED_VARIABLE etc. checks.  */
      'checkVars',
    ],

    // externs: '/tmp/ba478ed3b83221d1d16de9b9b44a8516af03421d',

    // debug: true,
    // jscomp_off: '*',
  }),
];

/**
 * This plugin stack is used to resolve Node modules, including CommonJS and
 * JSON imports.
 */
export const RESOLUTION_PLUGINS = [
  /**
   * Bundle CJS modules.
   */
  commonjs({
    transformMixedEsModules: true,
  }),

  /**
   * Since CJS is supported, we must allow JSON resolution logic.
   */
  json(),

  /**
   * Manually disable packages that we don't want in the output, like
   * `fsevents`.
   */
  disablePackages(...DISABLED_MODULES),

  /**
   * Finally, resolve the remaining inputs. Leave builtins.
   */
  nodeResolve({
    browser: true,
    preferBuiltins: true,
  }),
];

/**
 * Plugins used to process Rollup output in the `dist/` directory.
 *
 * This will include hundreds of thousands of lines of Rollup output for
 * nontrivial Node packages, and a Closure Compiler pass is run on the input to
 * prevent us from crawling dead dependencies. The output will receive a second
 * pass with `-O ADVANCED` mode for maximum dead code elimination.
 */
export const DIST_PLUGINS = [
  ...DEFAULT_PLUGINS,

  /**
   * Closure Compile input with the lightest settings to minimize strain on
   * resolution logic in `commonjs` and `node-resolve` plugins.
   */
  ...MIN_DCE_PLUGINS,

  /** All plugins related to legacy Node resolution. */
  ...RESOLUTION_PLUGINS,

  /** Print bundle sizes after gzip. Purely cosmetic. */
  bundleSize(),
];

/**
 * Plugins used to process Rollup output for the `dev/` directory.
 */
const DEV_PLUGINS = [ ...DEFAULT_PLUGINS ];

/**
 * For Web Widgets projects, transpile class fields to getters first so
 * Closure Compiler can handle them in the dist stage.
 *
 * @see https://github.com/google/closure-compiler/issues/2731
 */
if (existsSync('.widgets')) DEV_PLUGINS.push(classFieldsToGetters());

export { DEV_PLUGINS };
