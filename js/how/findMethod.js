/* @flow */

var Method = require('./methods/Method');
var Options = require('./Options');
var SingleLineTextLineHeightMethod =
  require('./methods/SingleLineTextLineHeightMethod');
var PixelHeightContainerContentPaddingMethod =
  require('./methods/PixelHeightContainerContentPaddingMethod');
var AbsolutePositionMethod = require('./methods/AbsolutePositionMethod');

// This list is in order of preference. The first applicable method should be
// used, as it's probably simpler.
var methods = [
  new SingleLineTextLineHeightMethod(),
  new PixelHeightContainerContentPaddingMethod(),
  new AbsolutePositionMethod,
];

function findMethod(
  content: Options.Content,
	container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment
): ?Method {
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    if (method.getRequirement().check(content, container, horizontalAlignment, verticalAlignment)) {
      return method;
    }
  }
  return null;
}

module.exports = findMethod;
