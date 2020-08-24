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

import {
  spacer,
  callNpm,
  installPeerDependencies,
  installGnvDependencies,
} from '../package.js';

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
 * Install gnvDependencies for the package.json in the parent folder.
 */
installGnvDependencies(true);


/**
 * Install peerDependencies for the package.json in the parent folder, and link
 * into local `node_modules`.
 */
installPeerDependencies(true);
