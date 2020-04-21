'use strict';

var _require = require('./webpack.plugins'),
    extractCss = _require.extractCss,
    extractSass = _require.extractSass,
    noErrors = _require.noErrors;

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: null,
  module: {
    loaders: [{
      test: [/\.png(\?|$)/, /\.gif(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/, /\.jpe?g(\?|$)/],
      loader: 'url-loader'
    }, { test: [/\.svg(\?|$)/], include: /node_modules/, loader: 'url-loader' }, { test: /\.css$/, loader: extractCss.extract('css-loader') }, {
      test: /\.scss$/,
      loader: extractSass.extract(['css-loader?sourceMap', 'sass-loader?sourceMap'])
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?sourceMaps=true'
    }]
  },

  output: { filename: 'spec.js' },
  plugins: [noErrors, extractCss, extractSass],
  quiet: true,
  watch: true
};