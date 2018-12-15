const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    earthquakes: './src/__demo__/earthquakes/demo.ts',
    'earthquakes-react': './src/__demo__/earthquakes/demo-react.tsx',
    mountains: './src/__demo__/mountains/demo.ts',
    'mountains-react': './src/__demo__/mountains/demo-react.tsx',
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
