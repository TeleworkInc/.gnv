/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install this package's release and dev dependencies. Relies on package.js,
 * and cannot use any third party modules.
 */

import { install } from '../../package.js';
(async () => await install({
  self: true,
  dev: true,
}))();
