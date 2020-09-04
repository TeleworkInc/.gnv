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

/** Build all exe.* in exports. */
glob.sync('exports/exe.*').map(
    (file) => spawnSync(
        'google-closure-compiler',
        [
          /** Language in/out and compilation level. */
          '--language_in ES_NEXT',
          '--language_out ECMASCRIPT5_STRICT',
          '-O ADVANCED',
          /** Handle Node and CJS/ESM. */
          '--process_common_js_modules',
          '--module_resolution NODE',
          '--dependency_mode PRUNE',
          /** Bundle into one giant closure, use type optimization. */
          '--isolation_mode IIFE',
          '--assume_function_wrapper',
          '--use_types_for_optimization',
          '--extra_annotation_name constructor',
          /** Logic for @defines. */
          '--jscomp_off unknownDefines',
          '-D PRODUCTION=true',
          '-D DEBUG=false',
          /** I/O settings. */
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
