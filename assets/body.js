'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var types = React.PropTypes;

var Body = function Body(_ref) {
  var entry = _ref.entry,
      scripts = _ref.scripts,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ['entry', 'scripts', 'className']);

  scripts = scripts.map(function (src, key) {
    return React.createElement('script', { type: 'text/javascript', src: src, key: key });
  });
  var entryFactory = React.createFactory(entry);
  var __html = ReactDOMServer.renderToString(entryFactory(props));
  return React.createElement(
    'body',
    { className: className },
    React.createElement('div', { id: 'root', dangerouslySetInnerHTML: { __html: __html } }),
    scripts
  );
};

Body.propTypes = {
  entry: types.func.isRequired,
  scripts: types.array.isRequired
};

module.exports = Body;