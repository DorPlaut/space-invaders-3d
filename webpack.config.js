const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const outputPath = isProduction ? 'public/dist' : 'dist';

module.exports = {
  // mode: 'development',
  mode: mode,
  entry: './public/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, outputPath),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },

    compress: true,
    port: 9000,
  },
};
