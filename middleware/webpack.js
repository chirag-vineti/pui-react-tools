'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var invariant = require('invariant');

var compiler = void 0,
    devMiddleware = void 0;

function getWebpackCompiler() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'development';

  if (compiler) return compiler;
  var webpack = require('webpack');
  var webpackConfig = require('../webpack/webpack.config')(env);
  compiler = webpack(webpackConfig);
  return compiler;
}

var middleware = {
  dev: function dev() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    devMiddleware = webpackDevMiddleware(getWebpackCompiler(process.env.NODE_ENV), _extends({
      overlay: true, noInfo: true, reload: true, stats: { colors: true }
    }, options));
    return devMiddleware;
  },
  hot: function hot() {
    return webpackHotMiddleware(getWebpackCompiler(process.env.NODE_ENV));
  },
  url: function url(name) {
    return function (req, res, next) {
      invariant(devMiddleware, 'must add a webpack dev middleware first!');
      var filename = devMiddleware.getFilenameFromUrl(name);
      devMiddleware.fileSystem.readFile(filename, function (err, content) {
        if (err) {
          next(err);
          return;
        }
        res.status(200).type('html').send(content);
      });
    };
  }
};

function webpackMiddleware() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return [middleware.dev(options.dev), middleware.hot(options.hot)];
}

module.exports = _extends(webpackMiddleware, middleware);