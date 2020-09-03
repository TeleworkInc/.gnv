/**
 * @license MIT
 */
/**
 * @fileoverview
 * Plugins for generating dist/ output with Rollup.
 */

import builtinModules from 'builtin-modules';
import path from 'path';
import { PACKAGE_ROOT, readPackageJson } from '../package.js';

/**
 * Rollup will hot-swap the source and re-compute PACKAGE_ROOT using
 * `import.meta` for this file, so we must resolve back to parent dir.
 */
const packageJson = readPackageJson(path.resolve(PACKAGE_ROOT, '..'));
const peerDeps = Object.keys(packageJson.peerDependencies || {});
const gnvDeps = Object.keys(packageJson.gnvDependencies || {});

// console.log({
//   PACKAGE_ROOT,
//   peerDeps,
//   gnvDeps,
// });

export const disabledModules = [
  'fsevents',
];

export const distExternal = [
  /**
   * Builtins and manually disabled packages.
   */
  ...builtinModules,
  ...disabledModules,
  /**
   * Package.json dependencies.
   */
  ...peerDeps,
];

export const devExternal = [
  ...distExternal,
  ...gnvDeps,
];
