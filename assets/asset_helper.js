'use strict';

var join = require('url-join');
var path = require('path');
var Url = require('url');

function assetPath(asset) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Url.parse(asset).host) return asset;

  var defaultManifestPath = path.join(process.cwd(), 'public', 'rev-manifest.json');
  var assetHost = options.assetHost,
      assetPort = options.assetPort,
      _options$useRevManife = options.useRevManifest,
      useRevManifest = _options$useRevManife === undefined ? true : _options$useRevManife,
      _options$manifestPath = options.manifestPath,
      manifestPath = _options$manifestPath === undefined ? defaultManifestPath : _options$manifestPath;

  if (assetHost) return '//' + join.apply(undefined, [[assetHost, assetPort].filter(Boolean).join(':'), asset]);

  if (!useRevManifest) return '/' + asset;
  var revManifest = void 0;
  try {
    revManifest = require(manifestPath);
  } catch (e) {
    revManifest = {};
  }
  return '/' + (revManifest[asset] || asset);
}

function getEntry(webpackConfig) {
  var entry = webpackConfig.entry;
  var defaultEntryPath = './app/components/application.js';

  if (!entry) return defaultEntryPath;
  if (entry.constructor === String) return entry;
  if (Array.isArray(entry)) return entry[0];
  if (Array.isArray(entry.application)) return entry.application[0];
  if (entry.application) return entry.application;
  return Object.values(entry)[0];
}

module.exports = { assetPath: assetPath, getEntry: getEntry };