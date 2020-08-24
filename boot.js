/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install gnvDependencies and peerDependencies. This file cannot use third
 * party modules.
 *
 * @author Christian Lewis <hello@trytelework.com>
 */

import { readPackageJson } from '../package.js';
import { spawnSync } from 'child_process';

const packageJson = readPackageJson();

const versionString = (deps = {}) => (
  Object.entries(deps || {}).map(
      ([key, val]) => `${key}@${val}`,
  )
);

const spacer = (str) => console.log(
    '\x1b[96m%s\x1b[0m', `[𝓰𝓷𝓿]` + ` ${str}`,
);

const gnvDependencies = versionString(packageJson.gnvDependencies);
const peerDependencies = versionString(packageJson.peerDependencies);

const callNpm = (...args) => {
  console.log(`\n> npm ${args.join(' ')}\n`);
  spawnSync(
      'npm',
      args,
      {
        /**
         * Only inherit stderr.
         */
        stdio: ['ignore', 'ignore', 'inherit'],
      },
  );
};

/** Remove visual clutter. */
console.log();


/**
 * Link this package. This has to be done before everything else due to the
 * weird behavior of npm, which will delete necessary dependencies if this is
 * run after installing peerDeps or gnvDeps.
 */
spacer('Linking this package to global bin...');
callNpm('link', '-f', '--no-save', '--silent');


/**
 * Install gnvDependencies in this folder without updating package.json.
 */
if (gnvDependencies.length) {
  spacer('Adding local gnv deps to node_modules:');
  callNpm('i', '-f', '--no-save', '--silent', ...gnvDependencies);
}


/**
 * Globally install all peerDependencies without updating package.json, then
 * link all globally installed peerDeps to make them available in this package.
 */
if (peerDependencies.length) {
  /**
   * Make sure no previous versions of this package are linked in this
   * workspace.
   */
  const anyVersionPeerDeps = Object.keys(packageJson.peerDependencies);

  /**
   * Install peerDeps globally.
   */
  spacer('Adding global peerDeps:');
  callNpm('i', '-g', '--no-save', ...peerDependencies);

  /**
   * Link peerDeps locally. Also links this package so that CLIs are available.
   */
  spacer('Linking peer dependencies locally...');
  callNpm('link', '-f', '--no-save', ...anyVersionPeerDeps);

  /**
   * Everything was successful!
   */
  spacer('Done! Your development CLI should be ready at `gnv-dev`.\n');
}