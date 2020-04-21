'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var fs = require('fs');
var camelCase = require('lodash.camelcase');
var path = require('path');

var env = {};

try {
  env = require(path.join(process.cwd(), 'config', 'env.json')).reduce(function (memo, key) {
    if (key in process.env) {
      var keyCamelCase = camelCase(key);
      if (key.startsWith('USE_')) {
        memo[keyCamelCase] = String(process.env[key]) !== 'false';
      } else {
        memo[keyCamelCase] = process.env[key];
      }
    }
    return memo;
  }, {});
} catch (e) {}

function requireEnvFile() {
  for (var _len = arguments.length, files = Array(_len), _key = 0; _key < _len; _key++) {
    files[_key] = arguments[_key];
  }

  return files.map(function (filename) {
    return path.join(process.cwd(), 'config', filename + '.json');
  }).filter(fs.existsSync).map(function (filename) {
    return require(filename);
  });
}

var config = [].concat(requireEnvFile('application', process.env.NODE_ENV || 'development'), [env], requireEnvFile('local')).reduce(function (memo, json) {
  return _extends({}, memo, json);
}, {});

module.exports = config;