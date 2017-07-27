const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
    stats: 'minimal',
  },

  devtool: 'cheap-eval-source-map',
};