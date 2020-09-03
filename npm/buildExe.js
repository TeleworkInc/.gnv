/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

if (!existsSync('exports/exe.js')) {
  console.log('No exe export found in exports/.');
  process.exit(0);
}

spawnSync(
    'google-closure-compiler',
    [
      '--language_in ES_NEXT',
      '--language_out ECMASCRIPT5_STRICT',
      '-O ADVANCED',
      '-D compiler.globals.PRODUCTION=true',
      '--process_common_js_modules',
      '--module_resolution NODE',
      '--dependency_mode PRUNE',
      '--isolation_mode IIFE',
      '--assume_function_wrapper',
      '--use_types_for_optimization',
      '--entry_point exports/exe.js',
      '--js lib/**.js',
      '--js exports/**.js',
      '--js_output_file dist/exe.js',
    ],
    {
      shell: true,
      stdio: 'inherit',
    },
);
