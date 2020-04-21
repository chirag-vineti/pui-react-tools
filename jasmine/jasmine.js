'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// const gulp = require('gulp');
var mergeStream = require('merge-stream');

var _require = require('gulp-load-plugins')(),
    jasmine = _require.jasmine,
    jasmineBrowser = _require.jasmineBrowser,
    plumber = _require.plumber,
    processEnv = _require.processEnv;

var webpack = require('webpack-stream');
var pipe = require('multipipe');

var Jasmine = {
  installOptions: {
    browserAppAssetsOptions: {},
    browserServerOptions: {},
    browserSpecRunnerOptions: {},
    getAdditionalAppAssets: function getAdditionalAppAssets() {
      return [];
    },
    headlessAppAssetsOptions: {},
    headlessServerOptions: {},
    headlessSpecRunnerOptions: {},
    serverOptions: {},
    appGlobs: ['spec/app/**/*_spec.js'],
    serverGlobs: ['spec/server/**/*.js', 'spec/lib/**/*.js', 'spec/helpers/**/*.js']
  },

  install: function install() {
    var installOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var gulp = installOptions.gulp;
    _extends(Jasmine.installOptions, installOptions);
    gulp.task('jasmine', Jasmine.tasks.jasmine);

    gulp.task('spec-app', function (done) {
      Jasmine.tasks.specApp(done);
    });

    // gulp.task('spec-server', Jasmine.tasks.specServer);
  },
  appAssets: function appAssets(options) {
    var gulpOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var javascript = gulp.src(Jasmine.installOptions.appGlobs, gulpOptions).pipe(plumber());

    if (options !== false) {
      var _ref = options || {},
          plugins = _ref.plugins,
          rest = _objectWithoutProperties(_ref, ['plugins']);

      var testConfig = require('../webpack/webpack.config')('test', rest);
      var webpackConfig = _extends({}, testConfig, options, {
        plugins: (testConfig.plugins || []).concat(plugins || [])
      });
      javascript = javascript.pipe(webpack(webpackConfig));
    }

    return mergeStream.apply(undefined, [javascript, gulp.src(require.resolve('./jasmine.css'), gulpOptions)].concat(Jasmine.installOptions.getAdditionalAppAssets()));
  },
  serverAssets: function serverAssets() {
    var gulpOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return gulp.src(Jasmine.installOptions.serverGlobs, gulpOptions).pipe(plumber());
  },


  tasks: {
    jasmine: function jasmine() {
      var plugin = new (require('gulp-jasmine-browser/webpack/jasmine-plugin'))();
      var _Jasmine$installOptio = Jasmine.installOptions,
          browserAppAssetsOptions = _Jasmine$installOptio.browserAppAssetsOptions,
          browserServerOptions = _Jasmine$installOptio.browserServerOptions,
          browserSpecRunnerOptions = _Jasmine$installOptio.browserSpecRunnerOptions;

      return Jasmine.appAssets({ plugins: [plugin], browserAppAssetsOptions: browserAppAssetsOptions }).pipe(jasmineBrowser.specRunner(browserSpecRunnerOptions)).pipe(jasmineBrowser.server(_extends({
        whenReady: plugin.whenReady
      }, browserServerOptions)));
    },
    specApp: function specApp(done) {
      var _Jasmine$installOptio2 = Jasmine.installOptions,
          headlessAppAssetsOptions = _Jasmine$installOptio2.headlessAppAssetsOptions,
          headlessServerOptions = _Jasmine$installOptio2.headlessServerOptions,
          headlessSpecRunnerOptions = _Jasmine$installOptio2.headlessSpecRunnerOptions;

      return Jasmine.appAssets(_extends({
        watch: false,
        done: done
      }, headlessAppAssetsOptions)).pipe(jasmineBrowser.specRunner(_extends({
        console: true
      }, headlessSpecRunnerOptions))).pipe(jasmineBrowser.headless(_extends({
        driver: 'phantomjs'
      }, headlessServerOptions))).on('data', function (x) {
        return x;
      }).on('end', done);
    },
    specServer: function specServer() {
      var env = processEnv({ NODE_ENV: 'test' });
      return pipe(Jasmine.serverAssets(), env, jasmine(_extends({
        includeStackTrace: true
      }, Jasmine.installOptions.serverOptions)), env.restore());
    }
  }
};

module.exports = Jasmine;