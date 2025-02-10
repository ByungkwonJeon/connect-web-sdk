/**
 * Rollup Configuration for Connect Web SDK
 *
 * This configuration bundles the SDK using Rollup, ensuring that the output
 * is optimized, tree-shaken, and compatible with different module formats.
 */

import typescript from '@rollup/plugin-typescript'; // Compiles TypeScript
import commonjs from '@rollup/plugin-commonjs'; // Converts CommonJS modules to ES6
import resolve from '@rollup/plugin-node-resolve'; // Resolves node_modules dependencies
import json from '@rollup/plugin-json';
import terser from "@rollup/plugin-terser"; // Allows importing JSON files

export default {
    // Entry point for the SDK
    input: 'src/index.ts',

    // Output configurations
    output: [
        {
            file: 'dist/index.esm.js', // ES Module output
            format: 'esm', // ECMAScript module format
            sourcemap: true // Enable source maps for debugging
        },
        {
            file: 'dist/index.cjs.js', // CommonJS output
            format: 'cjs', // CommonJS format for Node.js
            sourcemap: true
        },
        {
            file: 'dist/index.umd.js', // UMD output (Universal Module Definition)
            format: 'umd',
            name: 'ConnectSDK', // Global variable name when loaded in a browser
            sourcemap: true
        }
    ],

    // Plugins used to process and optimize the code
    plugins: [
        /**
         * TypeScript Plugin
         * - Transpiles TypeScript files into JavaScript.
         * - Ensures type-checking and generates type declaration files.
         */
        typescript({
            tsconfig: './tsconfig.build.json', // Uses the build-specific TypeScript config
            declaration: true, // Generates type declaration files
            declarationDir: 'dist/types', // Specifies the output directory for .d.ts files
            sourceMap: true
        }),

        /**
         * CommonJS Plugin
         * - Converts CommonJS modules (from node_modules) into ES6 format.
         * - Required for using dependencies that are only available in CommonJS.
         */
        commonjs(),

        /**
         * Node Resolve Plugin
         * - Resolves third-party modules from `node_modules`.
         * - Ensures compatibility with external libraries that use CommonJS or ESM.
         */
        resolve(),

        /**
         * JSON Plugin
         * - Enables importing JSON files within the SDK.
         * - Useful for configuration files or metadata.
         */
        json(),

        /**
         * Terser Plugin
         * - Minifies the JavaScript output to reduce file size.
         * - Removes unnecessary comments and whitespace.
         * - Optimizes the code for better performance.
         */
        terser()
    ]
};