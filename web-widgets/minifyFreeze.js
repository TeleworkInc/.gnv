/** @license MIT */
/**
 * @fileoverview
 * Inline the exe.namespace.js script so the bundle is shipped as one gzipped
 * resource.
 */

import inlineSource from 'inline-source';
import fsPromises from 'fs/promises';

(async () => {
  try {
    const html = await inlineSource.inlineSource(
        'widget.freeze.html',
        {
          compress: false,
          ignore: [ 'css', 'png' ],
        },
    );

    await fsPromises.writeFile('widget.freeze.html', html);
    console.log('Minified widget.freeze.html.');
  }
  catch (err) {
    console.log(err);
  }
})();
