'use strict';

var loaderUtils = require('loader-utils');
var ReactDOMServer = require('react-dom/server');
var React = require('react');

function compile(Entry, Layout) {
  var _require = require('./asset_helper'),
      assetPath = _require.assetPath;

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


  var assetConfig = { assetHost: assetHost, assetPort: assetPort, useRevManifest: useRevManifest };
  var stylesheetPaths = stylesheets.map(function (f) {
    return assetPath(f, assetConfig);
  });
  var scriptPaths = ['/config.js'].concat(scripts.map(function (f) {
    return assetPath(f, assetConfig);
  }));
  var props = { entry: Entry, scripts: scriptPaths, stylesheets: stylesheetPaths, title: title, config: config };
  var html = '<!doctype html>' + ReactDOMServer.renderToStaticMarkup(React.createElement(Layout, props));
  return html;
}

function htmlLoader(content) {
  if (this.cacheable) this.cacheable();
  if (!this.emitFile) throw new Error('emitFile is required from module system');
  var query = loaderUtils.parseQuery(this.query);

  var Entry = this.exec(content, this.resourcePath);

  var layoutPath = query.layout || './layout';
  var Layout = require(layoutPath);
  var html = compile(Entry, Layout);

  this.addDependency(this.resourcePath);
  this.addDependency(layoutPath);

  var url = loaderUtils.interpolateName(this, query.name || '[name].html', {
    context: query.context || this.options.context,
    content: html,
    regExp: query.regExp
  });
  this.emitFile(url, html);
  return '';
}

module.exports = htmlLoader;