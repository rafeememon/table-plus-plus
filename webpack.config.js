const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    earthquakes: './src/demo/earthquakes/demo.ts',
    fourteeners: './src/demo/fourteeners/demo.ts',
    'fourteeners-react': './src/demo/fourteeners/demo-react.tsx',
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
