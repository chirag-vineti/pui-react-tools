'use strict';

var HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

var _require = require('./webpack.plugins'),
    noErrors = _require.noErrors;

var _require2 = require('../assets/config'),
    assetHost = _require2.assetHost,
    assetPort = _require2.assetPort;

var publicPath = assetHost ? '//' + assetHost + ':' + assetPort + '/' : '/';

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    application: ['./app/components/application.js', 'webpack-hot-middleware/client?path=' + (publicPath + '__webpack_hmr')]
  },
  externals: null,
  module: {
    loaders: [{
      test: [/\.png(\?|$)/, /\.gif(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.jpe?g(\?|$)/],
      loader: 'url-loader'
    }, { test: [/\.svg(\?|$)/], include: /node_modules/, loader: 'url-loader' }, {
      test: /\.css$/,
      exclude: /typography/,
      loaders: ['style-loader', 'css-loader?sourceMap']
    }, {
      test: /\.css$/,
      include: /typography/,
      loaders: ['style-loader', 'css-loader']
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader', 'sass-loader?sourceMap']
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot-loader', 'babel-loader']
    }]
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    path: __dirname,
    pathinfo: true,
    publicPath: publicPath
  },
  plugins: [new HotModuleReplacementPlugin(), noErrors],
  watch: true
};