var React = require('react/addons');
var nodeJSX = require('node-jsx');
nodeJSX.install({
  harmony: true,
  stripTypes: true,
});

var MainComponent = require('./components/MainComponent');
var MainComponentFactory = React.createFactory(MainComponent);

var renderedHTML = React.renderToString(MainComponentFactory({}));

console.log(renderedHTML);
