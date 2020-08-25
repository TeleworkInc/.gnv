/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import { spawnSync } from 'child_process';

spawnSync(
    'google-closure-compiler',
    [
      '--entry_point dev/universal.mjs',
      '-O ADVANCED',
      '--process_common_js_modules',
      '--module_resolution NODE',
      '--dependency_mode PRUNE',
      '--js $(npm root -g)/google-closure-library/closure/goog/base.js',
      '--js dev/universal.mjs',
      '--js_output_file dist/exe.js',
    ],
    {
      shell: true,
      stdio: 'inherit',
    },
);
