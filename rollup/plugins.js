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

import { DISABLED_MODULES } from './externs.js';
import { existsSync } from 'fs';

/**
 * Plugins that will always be used.
 */
const DEFAULT_PLUGINS = [
  /**
   * Leave shebangs if present.
   */
  shebang(),
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
  closureCompiler({
    /** Dist @define flags. */
    define: [
      'RELEASE=true',
      'DEV=false',
    ],
    compilation_level: 'SIMPLE',
    /** Use most recent language features. */
    language_in: 'ES_NEXT',
    /** Do not transpile. */
    language_out: 'NO_TRANSPILE',
  }),
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
    preferBuiltins: true,
  }),
  /**
   * Print bundle sizes after gzip. Purely cosmetic.
   */
  bundleSize(),
];

/**
 * Plugins used to process Rollup output for the `dev/` directory. 
 */
let DEV_PLUGINS = [...DEFAULT_PLUGINS];

/**
 * For Web Widgets projects, transpile class fields to getters first so
 * Closure Compiler can handle them in the dist stage.
 *
 * @see https://github.com/google/closure-compiler/issues/2731
 */
if (existsSync('.widgets')) DEV_PLUGINS.push(classFieldsToGetters());

export { DEV_PLUGINS };