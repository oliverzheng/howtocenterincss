/* @flow */

var Method = require('./methods/Method');
var Options = require('./Options');
var DoNothingMethod = require('./methods/DoNothingMethod');
var SingleLineTextLineHeightMethod =
  require('./methods/SingleLineTextLineHeightMethod');
var PixelHeightContainerContentPaddingMethod =
  require('./methods/PixelHeightContainerContentPaddingMethod');
var AbsolutePositionMethod = require('./methods/AbsolutePositionMethod');
var MarginAutoMethod = require('./methods/MarginAutoMethod');
var TableCellMethod = require('./methods/TableCellMethod');
var FlexMethod = require('./methods/FlexMethod');
var TextAlignMethod = require('./methods/TextAlignMethod');

// This list is in order of preference. The first applicable method should be
// used, as it's probably simpler.
var methods = [
  new DoNothingMethod,
  new TextAlignMethod,
  new SingleLineTextLineHeightMethod(),
  new MarginAutoMethod(),
  new PixelHeightContainerContentPaddingMethod(),
  new FlexMethod,
  new AbsolutePositionMethod,
  new TableCellMethod,
];

function findMethod(
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
): ?Method {
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    if (method.getRequirement().check(content, container, horizontalAlignment, verticalAlignment, browserSupport)) {
      return method;
    }
  }
  return null;
}

module.exports = findMethod;
