const webpack = require('webpack');

const shims = [
  'core-js/shim',
  'whatwg-fetch',
];

module.exports = {
  mode: 'development',

  entry: {
    earthquakes: [...shims, './src/__demo__/earthquakes/demo.ts'],
    'earthquakes-fixed': [...shims, './src/__demo__/earthquakes/demo-fixed.ts'],
    'earthquakes-react': [...shims, './src/__demo__/earthquakes/demo-react.tsx'],
    'earthquakes-sheet': [...shims, './src/__demo__/earthquakes/demo-sheet.ts'],
    mountains: [...shims, './src/__demo__/mountains/demo.ts'],
    'mountains-react': [...shims, './src/__demo__/mountains/demo-react.tsx'],
  },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'tslint-loader', enforce: 'pre' },
      { test: /\.js$/, use: 'source-map-loader', enforce: 'pre' },
      { test: /\.tsx?$/, use: 'ts-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
};
