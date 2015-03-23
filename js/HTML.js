/** @flow */

var React = require('react/addons');
var MainComponent = require('./components/MainComponent');

var renderedHTML = React.renderToString(
  <MainComponent />
);

module.exports = renderedHTML;
