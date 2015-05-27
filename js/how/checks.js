/* @flow */

var Options = require('./Options');

var invariant = require('invariant');

type Check = (
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
) => bool;

function checkContent(check: (content: Options.Content) => bool): Check {
  return (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
    return check(content);
  };
}

function checkContainer(check: (container: Options.Container) => bool): Check {
  return (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
    return check(container);
  };
}

function checkContentText(check: (text: Options.Text) => bool): Check {
  return (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
    return content.text != null && check(content.text);
  };
}

function checkContentIsText(
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
): bool {
  return content.text != null;
}

function checkContentNotText(
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
): bool {
  return content.text == null;
}

function requireLineHeight(
  requirement: (text: Options.Length) => bool
): (obj: Options.Text) => bool {
  return (obj) => obj.lineHeight != null && requirement(obj.lineHeight);
}

var requireLineHeightExists = requireLineHeight((l) => true);

function requireFontSize(
  requirement: (text: Options.Length) => bool
): (obj: Options.Text) => bool {
  return (obj) => obj.fontSize != null && requirement(obj.fontSize);
}

var requireFontSizeExists = requireFontSize((l) => true);

function requireHeight(
  requirement: (length: Options.Length) => bool
): (obj: Options.Content | Options.Container) => bool {
  return (obj) => obj.height != null && requirement(obj.height);
}

var requireHeightExists = requireHeight((l) => true);

function requireWidth(
  requirement: (length: Options.Length) => bool
): (obj: Options.Content | Options.Container) => bool {
  return (obj) => obj.width != null && requirement(obj.width);
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
  return (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
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
  return (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
    return alignments.indexOf(verticalAlignment) !== -1;
  };
}

function checkVerticalAlignment(
  alignment: Options.VerticalAlignment
): Check {
  return checkAnyVerticalAlignment([alignment]);
}

function checkBrowserSupport(requirementBrowserSupport: Options.BrowserSupport): Check {
  return (content, container, horizontalAlignment, verticalAlignment, userBrowserSupport) => {
    return requirementBrowserSupport.requiresBrowserSupport(userBrowserSupport);
  };
}

module.exports.checkContent = checkContent;
module.exports.checkContainer = checkContainer;
module.exports.checkContentText = checkContentText;
module.exports.checkContentIsText = checkContentIsText;
module.exports.checkContentNotText = checkContentNotText;
module.exports.requireLineHeight = requireLineHeight;
module.exports.requireLineHeightExists = requireLineHeightExists;
module.exports.requireFontSize = requireFontSize;
module.exports.requireFontSizeExists = requireFontSizeExists;
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
module.exports.checkBrowserSupport = checkBrowserSupport;
