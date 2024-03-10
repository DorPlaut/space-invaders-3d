const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,
  entry: './public/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'src'),
  //   },
  //   compress: true,
  //   port: 9000,
  // },
};
