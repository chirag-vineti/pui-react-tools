'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var path = require('path');

var userWebpackConfig = {};
try {
  userWebpackConfig = require(path.join(process.cwd(), 'pui-react-tools')).webpack;
} catch (e) {}

module.exports = function (env) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var envConfig = {};
  try {
    envConfig = require('./' + env);
  } catch (e) {}

  var userEnvConfig = userWebpackConfig[env];

  var baseConfig = require('./base');

  var userBaseConfig = userWebpackConfig.base;

  return _extends({}, baseConfig, userBaseConfig || {}, envConfig, userEnvConfig || {}, options);
};