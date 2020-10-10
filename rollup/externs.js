/**
 * @license MIT
 */
/**
 * @fileoverview
 * All externs for the Rollup process.
 */

import builtinModules from 'builtin-modules';
import path from 'path';

import { PACKAGE_ROOT, readPackageJson } from '../../package.js';

/**
 * Rollup will hot-swap the source and re-compute PACKAGE_ROOT using
 * `import.meta` for this file, so we must resolve back to parent dir.
 *
 * This only occurs when executing this file via `rollup -c`, which is the only
 * time this file will ever be executed, so this is tolerable, though not
 * optimal.
 *
 * @see https://github.com/rollup/rollup/issues/3758
 */
const packageJson = readPackageJson(path.resolve(PACKAGE_ROOT, '../../'));

const [
  deps,
  devDeps,
  gnvDeps,
  optionalDeps,
  peerDeps,
] = [
  'dependencies',
  'devDependencies',
  'gnvDependencies',
  'optionalDependencies',
  'peerDependencies',
].map(
  (field) => Object.keys(packageJson[field] || {})
);

/**
 * Rollup cannot bundle these, and they should be disabled in the output
 * completely.
 */
export const DISABLED_MODULES = [
  'fsevents',
];

export const DIST_EXTERNS = [
  /**
   * Ignore disabled modules.
   */
  ...DISABLED_MODULES,
  /**
   * Ignore builtins.
   */
  ...builtinModules,
  /**
   * Ignore peerDeps, should be available globally.
   */
  ...peerDeps,
];

export const DEV_EXTERNS = [
  /**
   * Inherit all dist externs.
   */
  ...DIST_EXTERNS,
  /**
   * Also ignore local workspace dependencies.
   */
  ...deps,
  ...devDeps,
  ...gnvDeps,
  ...optionalDeps,
];