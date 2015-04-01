/* @flow */

var Options = require('./Options');

var invariant = require('invariant');

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

function requireWidth(
  requirement: (length: Options.Length) => bool
): (obj: Options.Content | Options.Container) => bool {
  return (obj) => obj.width && requirement(obj.width);
}

var requireWidthExists = requireWidth((w) => true);

function requireIsPixel(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.PIXEL;
}

function requireIsPercentage(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.PERCENTAGE;
}

function requireIsEm(length: Options.Length): bool {
	return length.lengthType === Options.LengthType.EM;
}

function checkAnyHorizontalAlignment(
  alignments: Array<Options.HorizontalAlignment>
): Check {
	return (content, container, horizontalAlignment, verticalAlignment) => {
    return alignments.indexOf(horizontalAlignment) !== -1;
  };
}

function checkHorizontalAlignment(
  alignment: Options.HorizontalAlignment
): Check {
  return checkAnyHorizontalAlignment([alignment]);
}

function checkAnyVerticalAlignment(
  alignments: Array<Options.VerticalAlignment>
): Check {
	return (content, container, horizontalAlignment, verticalAlignment) => {
    return alignments.indexOf(verticalAlignment) !== -1;
  };
}

function checkVerticalAlignment(
  alignment: Options.VerticalAlignment
): Check {
  return checkAnyVerticalAlignment([alignment]);
}

module.exports.checkContent = checkContent;
module.exports.checkContainer = checkContainer;
module.exports.requireHeight = requireHeight;
module.exports.requireHeightExists = requireHeightExists;
module.exports.requireWidth = requireWidth;
module.exports.requireWidthExists = requireWidthExists;
module.exports.requireIsPixel = requireIsPixel;
module.exports.requireIsPercentage = requireIsPercentage;
module.exports.requireIsEm = requireIsEm;
module.exports.checkAnyHorizontalAlignment = checkAnyHorizontalAlignment;
module.exports.checkHorizontalAlignment = checkHorizontalAlignment;
module.exports.checkAnyVerticalAlignment = checkAnyVerticalAlignment;
module.exports.checkVerticalAlignment = checkVerticalAlignment;
