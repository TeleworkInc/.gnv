/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install this package. Relies on package.js, and cannot use any third party
 * modules.
 */

/**
 * Install this program in release mode.
 */
import { install } from '../../package.js';
(async () => await install({
  self: true,
}))();
