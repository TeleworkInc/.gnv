/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

if (!existsSync('dev/exe.mjs')) {
  console.log('No exe export found in exports/.');
  process.exit(0);
}

spawnSync(
    'google-closure-compiler',
    [
      '-O ADVANCED',
      '-D PRODUCTION=true',
      '--entry_point dev/exe.mjs',
      '--process_common_js_modules',
      '--module_resolution NODE',
      '--dependency_mode PRUNE',
      '--js $(npm root -g)/google-closure-library/closure/goog/base.js',
      '--js dev/exe.mjs',
      '--js_output_file dist/exe.js',
    ],
    {
      shell: true,
      stdio: 'inherit',
    },
);
