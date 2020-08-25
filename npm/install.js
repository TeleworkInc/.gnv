/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install this package. Relies on package.js, and cannot use any third party
 * modules.
 */

import { install } from '../../package.js';
(async () => await install({
  self: true,
}))();
