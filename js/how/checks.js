/* @flow */

var Options = require('./Options');

type Check = (
	content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment
) => bool;

function checkContent(check: (content: Options.Content) => bool): Check {
	return (content, container, horizontalAlignment, verticalAlignment) => {
		return check(content);
	};
}

function checkContainer(check: (container: Options.Container) => bool): Check {
	return (content, container, horizontalAlignment, verticalAlignment) => {
		return check(container);
	};
}

function requireHeight(
  requirement: (length: Options.Length) => bool
): (obj: Options.Content | Options.Container) => bool {
  return (obj) => obj.height && requirement(obj.height);
}

var requireHeightExists = requireHeight((l) => true);

function requireIsPixel(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.PIXEL;
}

function requireIsPercentage(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.PERCENTAGE;
}

function requireIsEm(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.EM;
}

module.exports.checkContent = checkContent;
module.exports.checkContainer = checkContainer;
module.exports.requireHeight = requireHeight;
module.exports.requireHeightExists = requireHeightExists;
module.exports.requireIsPixel = requireIsPixel;
module.exports.requireIsPercentage = requireIsPercentage;
module.exports.requireIsEm = requireIsEm;
