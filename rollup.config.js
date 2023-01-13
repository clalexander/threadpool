import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import zip from 'rollup-plugin-zip';
import commandLineArgs from 'command-line-args';
import servicesConfig from './services.json';

const optionDefinitions = [
  {
    name: 'only',
    type: String,
    multiple: true,
  },
];
const options = commandLineArgs(optionDefinitions, { partial: true });

const defaultConfig = {
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
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

const services = servicesConfig.services || [];
const onlyServices = options.only || services;
const entries = services
  .filter((service) => onlyServices.includes(service))
  .map((service) => ({
    ...defaultConfig,
    plugins: [
      ...defaultConfig.plugins,
      zip({
        file: `${service}.zip`,
      }),
    ],
    input: `services/${service}/index.ts`,
  }));

export default entries;
