/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import glob from 'glob';
import { spawnSync } from 'child_process';

// const exeExports = glob.sync('exports/exe.*');
const exeExports = glob.sync('dev/exe.*.mjs');

if (!exeExports.length) {
  console.log('No compiled exe exports found in dev/.');
  process.exit(0);
}

/** Build all exe exports. */
exeExports.map(
    (file) => spawnSync(
        'google-closure-compiler',
        [
          /** Language in/out and compilation level. */
          '--language_in ES_NEXT',
          '--language_out ECMASCRIPT5_STRICT',
          '-O ADVANCED',
          '-W VERBOSE',
          /** Handle Node and CJS/ESM. */
          '--process_common_js_modules',
          '--module_resolution NODE',
          '--dependency_mode PRUNE',
          /** Bundle into one giant closure, use type optimization. */
          '--isolation_mode IIFE',
          '--assume_function_wrapper',
          '--use_types_for_optimization',
          /** Use compiler polyfills. */
          '--rewrite_polyfills',
          /** Disable warnings for nonstandard JSDOC annotations. */
          '--jscomp_off nonStandardJsDocs',
          /** Disable warnings for unknown @defines. */
          '--jscomp_off unknownDefines',
          /** Logic for @defines. */
          '-D PRODUCTION=true',
          '-D DEBUG=false',
          /** I/O settings. */
          /** Adjusting to use Rollup output exe. */
          `--entry_point ${file}`,
          `--js ${file}`,
          `--js_output_file ${
            file.replace('dev/', 'dist/').replace('.mjs', '.js')
          }`,
        ],
        {
          shell: true,
          stdio: 'inherit',
        },
    ),
);
