'use strict';

var DefinePlugin = require('webpack/lib/DefinePlugin');

var _require = require('./webpack.plugins'),
    extractCss = _require.extractCss,
    extractSass = _require.extractSass,
    noErrors = _require.noErrors;

var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  plugins: [new DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }), new UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }), noErrors, extractCss, extractSass]
};