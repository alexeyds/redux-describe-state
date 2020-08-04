import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'lib/describe_state.js',
    output: { file: pkg.main, format: 'cjs', indent: false, exports: "auto" },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  }
];