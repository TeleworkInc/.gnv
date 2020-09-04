/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import glob from 'glob';
import { spawnSync } from 'child_process';

if (!glob.sync('exports/exe.*.js').length) {
  console.log('No exe export found in exports/.');
  process.exit(0);
}

glob.sync(
    'exports/exe.*',
).map(
    (file) => spawnSync(
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
          `--entry_point ${file}`,
          '--js lib/**.js',
          '--js exports/**.js',
          `--js_output_file ${file.replace('exports', 'dist')}`,
        ],
        {
          shell: true,
          stdio: 'inherit',
        },
    ),
);
