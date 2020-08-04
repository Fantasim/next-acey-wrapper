import external from 'rollup-plugin-peer-deps-external'
import url from '@rollup/plugin-url'
import babel from "@rollup/plugin-babel";

import pkg from './package.json'

const config = {
    input: './index.js',
    external: [ 'acey', 'react', 'next', /@babel\/runtime/, 'lodash/isEqual', 'lodash/cloneDeep'],
    output: [
        {
            globals: {
                'lodash/isEqual': 'isEqual',
                'lodash/cloneDeep': 'cloneDeep',
                'react': 'react',
                'acey': 'acey',
                '@babel/runtime/helpers/defineProperty': 'babelDefinePropertyHelpers'
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
            babelHelpers: 'runtime'
        }),
    ]
}

export default config