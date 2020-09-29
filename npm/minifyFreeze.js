/**
 * @license MIT
 */
/**
 * @fileoverview
 * Embed the compiled namespace.js into the frozen output.
 */

import fs from 'fs';

(async () => {
  const frozenOutput = await fs.promises.readFile('widget.freeze.html');
  const namespaceJs = await fs.readFileSync('dist/exe.namespace.js');

  const replaced = frozenOutput.toString().replace(
      '<script src="dist/exe.namespace.js"></script>',
      `<script>${namespaceJs}</script>`,
  );

  await fs.promises.writeFile('widget.freeze.html', replaced);
})();
