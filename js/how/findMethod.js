/* @flow */

var Method = require('./methods/Method');
var Options = require('./Options');
var SingleLineTextLineHeightMethod =
  require('./methods/SingleLineTextLineHeightMethod');

var methods = [
  new SingleLineTextLineHeightMethod(),
];

function findMethod(
  content: Options.Content,
	container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment
): ?Method {
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    if (method.getRequirements().every(
          (r) => r.check(content, container, horizontalAlignment, verticalAlignment)
        )) {
      return method;
    }
  }
  return null;
}

module.exports = findMethod;
