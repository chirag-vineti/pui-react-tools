'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var del = require('del');
var File = require('vinyl');
var requiredGulp = require('gulp');
var mergeStream = require('merge-stream');
var through2 = require('through2');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var _require = require('from2'),
    from = _require.obj;

var spy = require('through2-spy');
var webpack = require('webpack-stream');

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

var Assets = {
  Layout: require('./layout'),

  Body: require('./body'),

  install: function install() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _extends(Assets.installOptions, options);

    var gulp = Assets.installOptions.gulp || requiredGulp;

    gulp.task('clean-assets', Assets.tasks.cleanAssets);

    gulp.task('assets', gulp.series('clean-assets', Assets.tasks.assets));

    gulp.task('clean-assets-html', Assets.tasks.cleanAssetsHtml);

    gulp.task('assets-html', gulp.series('clean-assets-html', Assets.tasks.assetsHtml));

    gulp.task('assets-config', Assets.tasks.assetsConfig);

    if (Assets.installOptions.useAssetsServer) {
      gulp.task('assets-server', Assets.tasks.assetsServer);
    }
  },


  installOptions: {
    assets: {},
    useAssetsServer: true,
    buildDirectory: 'public',
    getAdditionalAppAssets: function getAdditionalAppAssets() {
      return [];
    },
    htmlBuildDirectory: undefined,
    Layout: undefined
  },

  all: function all() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        hotModule = _ref.hotModule;

    var assets = Assets.installOptions.assets;

    var watch = isDevelopment();
    var streams = ['config', 'html', !hotModule && 'javascript', 'sass', 'images'].map(function (asset) {
      return asset && assets[asset] !== false && Assets[asset]({ watch: watch });
    }).filter(Boolean).concat(Assets.installOptions.getAdditionalAppAssets());

    return mergeStream.apply(undefined, streams);
  },
  sass: function sass() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$watch = _ref2.watch,
        watch = _ref2$watch === undefined ? false : _ref2$watch;

    var gulp = Assets.installOptions.gulp || requiredGulp;

    var stream = gulp.src(['app/stylesheets/application.scss']).pipe(plugins.plumber());
    if (watch) {
      gulp.src('app/stylesheets/**/*.scss').pipe(plugins.progeny());
      stream = stream.pipe(plugins.watch('app/stylesheets/**/*.scss')).pipe(plugins.progeny());
    }
    return stream.pipe(plugins.cond(!isProduction(), function () {
      return plugins.sourcemaps.init();
    })).pipe(plugins.sass({ errLogToConsole: true })).pipe(plugins.autoprefixer()).pipe(plugins.cond(!isProduction(), function () {
      return plugins.sourcemaps.write();
    })).pipe(plugins.cond(isProduction(), function () {
      return plugins.postcss();
    }));
  },
  images: function images() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$watch = _ref3.watch,
        watch = _ref3$watch === undefined ? false : _ref3$watch;

    var gulp = Assets.installOptions.gulp || requiredGulp;
    var stream = gulp.src('app/images/**/*', { base: '.' });
    if (watch) stream = stream.pipe(plugins.watch('app/images/*'));
    return stream.pipe(plugins.rename({ dirname: 'images' }));
  },
  html: function html() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$watch = _ref4.watch,
        watch = _ref4$watch === undefined ? false : _ref4$watch;

    var gulp = Assets.installOptions.gulp || requiredGulp;

    var webpackConfig = require('../webpack/webpack.config')(process.env.NODE_ENV);

    var _require2 = require('./asset_helper'),
        assetPath = _require2.assetPath,
        getEntry = _require2.getEntry;

    var entry = getEntry(webpackConfig);
    var config = require('./config');
    var assetHost = config.assetHost,
        assetPort = config.assetPort,
        _config$scripts = config.scripts,
        scripts = _config$scripts === undefined ? ['application.js'] : _config$scripts,
        _config$stylesheets = config.stylesheets,
        stylesheets = _config$stylesheets === undefined ? ['application.css'] : _config$stylesheets,
        _config$title = config.title,
        title = _config$title === undefined ? 'The default title' : _config$title,
        useRevManifest = config.useRevManifest;

    var stream = gulp.src(entry).pipe(plugins.plumber());

    if (watch) {
      stream = stream.pipe(plugins.watch('app/**/*.js'));
    }

    var entryPath = path.join(process.cwd(), entry);

    return stream.pipe(through2.obj(function (file, enc, callback) {
      [entryPath, file.path, './layout'].map(require.resolve).forEach(function (f) {
        return delete require.cache[f];
      });
      try {
        var Layout = Assets.installOptions.Layout || Assets.Layout;
        var assetConfig = { assetHost: assetHost, assetPort: assetPort, useRevManifest: useRevManifest };
        var stylesheetPaths = stylesheets.map(function (f) {
          return assetPath(f, assetConfig);
        });
        var scriptPaths = ['/config.js'].concat(scripts.map(function (f) {
          return assetPath(f, assetConfig);
        }));
        var entryComponent = require(entryPath);
        var props = {
          entry: entryComponent,
          scripts: scriptPaths,
          stylesheets: stylesheetPaths,
          title: title,
          config: config
        };
        var html = '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(React.createElement(Layout, props));
        var indexFile = new File({
          path: 'index.html',
          contents: new Buffer(html)
        });
        callback(null, indexFile);
      } catch (e) {
        callback(e);
      }
    }));
  },
  config: function config() {
    var configOptions = require('./config');
    var globalNamespace = configOptions.globalNamespace || 'Application';
    var configOptionsJSON = JSON.stringify(configOptions);
    return from(function () {
      var configContents = new File({
        path: 'config.js',
        contents: new Buffer('window.' + globalNamespace + ' = {config: ' + configOptionsJSON + '}')
      });
      this.push(configContents);
      this.push(null);
    });
  },
  javascript: function javascript() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var gulp = Assets.installOptions.gulp || requiredGulp;
    var webpackConfig = require('../webpack/webpack.config')(process.env.NODE_ENV, options);

    var _require3 = require('./asset_helper'),
        getEntry = _require3.getEntry;

    var entry = getEntry(webpackConfig);

    var cssFilter = plugins.filter('*.css', { restore: true });
    return gulp.src([entry]).pipe(plugins.plumber()).pipe(webpack(webpackConfig)).pipe(cssFilter).pipe(plugins.autoprefixer()).pipe(cssFilter.restore);
  },


  tasks: {
    cleanAssets: function cleanAssets(done) {
      var buildDirectory = Assets.installOptions.buildDirectory;

      del([buildDirectory + '/*', '!' + buildDirectory + '/.gitkeep']).then(function () {
        return done();
      }, done);
    },
    cleanAssetsHtml: function cleanAssetsHtml(done) {
      var buildDirectory = Assets.installOptions.buildDirectory;

      var htmlBuildDirectory = Assets.installOptions.htmlBuildDirectory || buildDirectory;
      del([htmlBuildDirectory + '/index.html']).then(function () {
        return done();
      }, done);
    },
    assets: function assets() {
      var stream = Assets.all();
      var _Assets$installOption = Assets.installOptions,
          buildDirectory = _Assets$installOption.buildDirectory,
          gulp = _Assets$installOption.gulp;

      if (!isProduction()) return stream.pipe(gulp.dest(buildDirectory));
      var cloneSink = plugins.clone.sink();
      return stream.pipe(gulp.dest(buildDirectory)).pipe(plugins.rev()).pipe(plugins.revCssUrl()).pipe(cloneSink).pipe(gulp.dest(buildDirectory)).pipe(plugins.rev.manifest()).pipe(gulp.dest(buildDirectory)).pipe(cloneSink.tap()).pipe(plugins.gzip()).pipe(gulp.dest(buildDirectory));
    },
    assetsHtml: function assetsHtml(done) {
      var gulp = Assets.installOptions.gulp || requiredGulp;
      var watch = isDevelopment();
      var _Assets$installOption2 = Assets.installOptions,
          buildDirectory = _Assets$installOption2.buildDirectory,
          _Assets$installOption3 = _Assets$installOption2.htmlBuildDirectory,
          htmlBuildDirectory = _Assets$installOption3 === undefined ? buildDirectory : _Assets$installOption3;

      var once = false;
      Assets.html({ watch: watch }).pipe(gulp.dest(htmlBuildDirectory)).pipe(spy.obj(function (chunk) {
        if (once) return;
        if (chunk.path.match(/index\.html/)) {
          once = true;
          done();
        }
      }));
    },


    assetsServer: require('./assets_server'),

    assetsConfig: function assetsConfig(done) {
      var gulp = Assets.installOptions.gulp || requiredGulp;
      Assets.config().pipe(gulp.dest(Assets.installOptions.buildDirectory));
      done();
    }
  }
};

module.exports = Assets;