/**
 * @license MIT
 */
/**
 * @fileoverview
 * Plugins for generating dist/ output with Rollup.
 */

import shebang from 'rollup-plugin-preserve-shebang';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import disablePackages from 'rollup-plugin-disable-packages';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import bundleSize from 'rollup-plugin-bundle-size';

import { DISABLED_MODULES } from './rollup.externs.js';

/**
 * Plugins to use for rolling up Node deps.
 *
 * Includes a CL pass before CJS / Node resolution *plus* another pass after,
 * just to ensure that we are never crawling dead dependencies. Big concern as
 * the dependency tree gets large (which is common with npm packages).
 */
export const DIST_PLUGINS = [
  /**
   * Leave shebangs if present.
   */
  shebang(),
  /**
   * Closure Compile input with the lightest settings to minimize strain on
   * resolution logic in `commonjs` and `node-resolve` plugins.
   */
  closureCompiler({
    /** Dist @define flags. */
    define: [
      'PRODUCTION=true',
      'DEBUG=false',
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
 * Dev plugins.
 */
export const DEV_PLUGINS = [
  shebang(),
  bundleSize(),
];
