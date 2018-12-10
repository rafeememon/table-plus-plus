const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    earthquakes: './src/demo/earthquakes/demo.ts',
    fourteeners: './src/demo/fourteeners/demo.ts',
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
