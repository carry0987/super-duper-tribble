import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const isProduction = process.env.BUILD === 'production';
const sourceFile = 'src/main.ts';

// JS config
const jsConfig = {
    input: sourceFile,
    output: [
        {
            esModule: true,
            file: 'build/index.js',
            format: 'es',
            sourcemap: true,
            plugins: isProduction ? [terser()] : []
        }
    ],
    plugins: [
        typescript(),
        tsConfigPaths(),
        nodeResolve({ preferBuiltins: true }),
        commonjs(),
        json()
    ]
};

export default jsConfig;
