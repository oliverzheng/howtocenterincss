/** @flow */

var MainComponent = require('./components/MainComponent');
var React = require('react');
var qs = require('qs');
var attachFastClick = require('fastclick');
var LocationBar = require('location-bar');
var serialization = require('./serialization');
var Options = require('./how/Options');

attachFastClick(document.body);

var locationBar = new LocationBar();

function onOptionsChange(
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
) {
  var serialized = serialization.serializeOptions(
    content,
    container,
    horizontalAlignment,
    verticalAlignment,
    browserSupport
  );
  var serializedString = qs.stringify(serialized);
  // qs uses brackets[] for sub objects, but that's ugly. It supports parsing
  // dot notation, but not generating it. Let's just convert it over, since we
  // don't have any real user-inputable data that can contain [] anyway.
  var serializedString = serializedString
    .replace(/%5B/g, '.')
    .replace(/%5D/g, '');
  locationBar.update(serializedString);
}

var component = React.render(
  <MainComponent
    onOptionsChange={onOptionsChange}
  />,
  document.getElementById('app')
);

locationBar.onChange((path) => {
  var serialized = qs.parse(path);
  if (!serialized) {
    return;
  }

  var options = serialization.deserializeOptions(serialized);
  if (!options) {
    return;
  }

  var {
    content,
    container,
    horizontalAlignment,
    verticalAlignment,
    browserSupport,
  } = options;

  component.setOptions(
    content,
    container,
    horizontalAlignment,
    verticalAlignment,
    browserSupport
  );
});

locationBar.start();
