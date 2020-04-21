'use strict';

var express = require('express');
var webpackMiddleware = require('./../middleware/webpack');

module.exports = function () {
  var _require = require('./config'),
      _require$assetHost = _require.assetHost,
      assetHost = _require$assetHost === undefined ? 'localhost' : _require$assetHost,
      _require$assetPort = _require.assetPort,
      assetPort = _require$assetPort === undefined ? 3001 : _require$assetPort;

  var cors = require('cors');
  var server = express();
  server.use(cors());
  server.use.apply(server, webpackMiddleware());
  server.listen(assetPort, assetHost);
};