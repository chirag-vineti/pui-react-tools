'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var types = React.PropTypes;
var Body = require('./body');

var Layout = function (_React$Component) {
  _inherits(Layout, _React$Component);

  function Layout() {
    _classCallCheck(this, Layout);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Layout.prototype.render = function render() {
    var _props = this.props,
        stylesheets = _props.stylesheets,
        title = _props.title;

    stylesheets = stylesheets.map(function (href, key) {
      return React.createElement('link', { rel: 'stylesheet', type: 'text/css', href: href, key: key });
    });
    return React.createElement(
      'html',
      null,
      React.createElement(
        'head',
        null,
        React.createElement('meta', { charSet: 'utf-8' }),
        React.createElement('meta', { httpEquiv: 'x-ua-compatible', content: 'ie=edge' }),
        React.createElement('meta', { name: 'description', content: '' }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
        React.createElement('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' }),
        title && React.createElement(
          'title',
          null,
          title
        ),
        stylesheets
      ),
      React.createElement(Body, this.props)
    );
  };

  return Layout;
}(React.Component);

Layout.propTypes = {
  entry: types.func.isRequired,
  scripts: types.array.isRequired,
  stylesheets: types.array.isRequired,
  title: types.string
};


module.exports = Layout;