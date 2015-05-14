/** flow */

var assert = require('assert');
var Combinatorics = require('js-combinatorics').Combinatorics;
var Options = require('../how/Options');

var FONT_SIZE = 30; // px

var contents: Array<Options.Content> = [
  Options.Content.text(1, Options.Length.px(FONT_SIZE)),
];

var containers: Array<Options.Container> = [
  new Options.Container(Options.Length.px(200), Options.Length.px(200)),
];

var browsers = [
  {
    browserName: 'chrome',
    platform: 'Windows 8',
  },
  {
    browserName: 'firefox',
    platform: 'Windows 8',
  },
  {
    browserName: 'internet explorer',
    platform: 'Windows 8',
  },
];

var localBrowser = {
  browserName: 'chrome',
};

function generateTests(browsers) {
  return Combinatorics.cartesianProduct(
    contents,
    containers,
    [Options.HorizontalAlignment.LEFT, Options.HorizontalAlignment.CENTER, Options.HorizontalAlignment.RIGHT], 
    [Options.VerticalAlignment.TOP, Options.VerticalAlignment.MIDDLE, Options.VerticalAlignment.BOTTOM], 
    browsers
  ).toArray().map(test => {
    return {
      content: test[0],
      container: test[1],
      horizontal: test[2],
      vertical: test[3],
      browser: test[4],
    }
  });
}

function getHorizontalText(alignment) {
  if (alignment === Options.HorizontalAlignment.LEFT) {
    return 'left';
  } else if (alignment === Options.HorizontalAlignment.CENTER) {
    return 'center';
  } else if (alignment === Options.HorizontalAlignment.RIGHT) {
    return 'right';
  }
  assert(false);
}

function getVerticalText(alignment) {
  if (alignment === Options.VerticalAlignment.TOP) {
    return 'top';
  } else if (alignment === Options.VerticalAlignment.MIDDLE) {
    return 'middle';
  } else if (alignment === Options.VerticalAlignment.BOTTOM) {
    return 'bottom';
  }
  assert(false);
}

function getTestName(test): string {
  var name = '';
  var {
    content,
    container,
    horizontal,
    vertical,
    browser,
  } = test;

  name += '(' + getHorizontalText(horizontal) + ', ' + getVerticalText(vertical) + ') ';

  name += browser.browserName + ' ';
  if (browser.version) {
    name += 'v' + version;
  }
  return name;
}

function getSnapshotName(test): string {
  var name = '';
  var {
    content,
    container,
    horizontal,
    vertical,
    browser,
  } = test;

  name += 'content_';
  if (content.text) {
    name += 'text_';
    if (content.text.lines != null) {
      name += content.text.lines + '_lines_';
    }
    if (content.text.lineHeight) {
      name += content.text.lineHeight.toString() + '_lineHeight_';
    }
  } else {
    name += 'width_';
    if (content.width) {
      name += content.width.toString() + '_';
    } else {
      name += 'unknown_';
    }

    name += 'height_';
    if (content.height) {
      name += content.height.toString() + '_';
    } else {
      name += 'unknown_';
    }
  }

  name += 'container_';
  name += 'width_';
  if (container.width) {
    name += container.width.toString() + '_';
  } else {
    name += 'unknown_';
  }

  name += 'height_';
  if (container.height) {
    name += container.height.toString() + '_';
  } else {
    name += 'unknown_';
  }

  name += getHorizontalText(horizontal) + '_' + getVerticalText(vertical);

  return name;
}

module.exports = {
  browsers: browsers,
  localBrowser: localBrowser,
  getTestName: getTestName,
  getSnapshotName: getSnapshotName,

  generateTests: generateTests,

  fontSize: FONT_SIZE,
};
