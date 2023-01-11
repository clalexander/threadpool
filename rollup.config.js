import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import zip from 'rollup-plugin-zip';

const defaultConfig = {
  plugins: [
    resolve(),
    typescript(),
    commonjs({
      requireReturnsDefault: 'auto',
    }),
    json(),
    terser(),
  ],
  output: {
    format: 'cjs',
    dir: 'dist',
  },
  external: [
    'aws-sdk',
  ],
};

const entries = [
  {
    ...defaultConfig,
    plugins: [
      ...defaultConfig.plugins,
      zip({
        file: 'test.zip',
      }),
    ],
    input: 'services/test/index.ts',
    output: {
      ...defaultConfig.output,
    },
  },
];

export default entries;
