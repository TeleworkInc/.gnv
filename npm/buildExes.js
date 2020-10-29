/**
 * @license MIT
 */
/**
 * @fileoverview
 * Build the exe output. Use builtins only to avoid adding peerDeps.
 */

import glob from 'glob';
import { spawnSync } from 'child_process';

const exeExports = glob.sync('dev/exe.*');

if (!exeExports.length) {
  console.log('No compiled exe exports found in dev/.');
  process.exit(0);
}

/**
 * Build all exe exports.
 */
exeExports.map(
    (inputFile) => {
      const outputFile = inputFile.replace('dev/', 'dist/');
      spawnSync(
          'google-closure-compiler',
          [
          /**
           * Language in/out and compilation level.
           */
            '--language_in ES_NEXT',
            '--language_out ECMASCRIPT5_STRICT',
            '-O ADVANCED',
            '-W VERBOSE',

            /**
             * CJS/ESM flags.
             */
            '--process_common_js_modules',
            '--module_resolution NODE',
            '--dependency_mode PRUNE',

            /**
             * Compile to a type-optimized IIFE.
             */
            '--isolation_mode IIFE',
            '--assume_function_wrapper',
            '--use_types_for_optimization',

            /**
             * Disable compiler polyfills.
             */
            // '--rewrite_polyfills false',

            /**
             * Miscellaneous flags.
             */
            /** Disable warnings for nonstandard JSDOC annotations. */
            '--jscomp_off nonStandardJsDocs',
            /** Disable warnings for unknown @defines. */
            '--jscomp_off unknownDefines',

            /**
             * Compiler-time overrides for @defines.
             */
            /** Enable debugging for inputs from source dir. */
            `-D DEV=${outputFile.includes('dev/')}`,

            /** Set release flag if building to dist/. */
            `-D RELEASE=${outputFile.includes('dist/')}`,
            
            /** @todo Detect namespace, do not serialize CSS styles in JS. */
            // `-D NAMESPACE=${inputFile.includes('exe.namespace')}`,

            /**
             * I/O settings.
             */
            `--entry_point ${inputFile}`,
            `--js ${inputFile}`,
            `--js_output_file ${outputFile.replace('.mjs', '.js')}`,
          // `--variable_renaming_report map.${path.basename(file)}.vars.txt`,
          // `--property_renaming_report map.${path.basename(file)}.props.txt`,
          ],
          {
            shell: true,
            stdio: 'inherit',
          },
      );
    },
);
