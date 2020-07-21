import external from 'rollup-plugin-peer-deps-external'
import url from '@rollup/plugin-url'
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json'

const config = {
    input: './index.js',
    external: [ 'acey', 'react', 'next' ],
    output: [
        {
            globals: {
                'lodash': 'lodash',
                'react': 'react',
                'acey': 'acey',
            },
            file: pkg.main,
            format: 'umd',
            name: 'next-acey-wrapper'
        },
    ],
    plugins: [
        external(),
        url(),
        babel({ 
            exclude: 'node_modules/**',
            presets: ['@babel/env', '@babel/preset-react'],
            plugins: ["@babel/plugin-proposal-class-properties"]
        }),
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify());
}

export default config