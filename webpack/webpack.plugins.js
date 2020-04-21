'use strict';

var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');

var extractCss = new ExtractTextWebpackPlugin('css', 'components.css');
var extractSass = new ExtractTextWebpackPlugin('application-sass', '[name].css');
var noErrors = new NoErrorsPlugin();

module.exports = { extractCss: extractCss, extractSass: extractSass, noErrors: noErrors };