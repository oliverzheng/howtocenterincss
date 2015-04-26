/** flow */

var assert = require('assert');
var Combinatorics = require('js-combinatorics').Combinatorics;
var Options = require('../how/Options');

var contents: Array<Options.Content> = [
  Options.Content.text(1),
];

var containers: Array<Options.Container> = [
  new Options.Container(Options.Length.px(100), Options.Length.px(100)),
];

var browsers = [
  {
    browserName: 'chrome'
  },
  /*
  {
    browserName: 'firefox',
  },
  {
    browserName: 'internet explorer',
  },
  {
    browserName: 'safari',
  },
  {
    browserName: 'opera',
  },
  */
];
var defaultBrowser = browsers[0];

var allTests = Combinatorics.cartesianProduct(
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

  name += getHorizontalText(horizontal) + '_' + getVerticalText(vertical) + '_';

  name += browser.browserName;
  if (browser.version) {
    name += '_v' + version;
  }
  return name;
}

module.exports = {
  browsers: browsers,
  defaultBrowser: defaultBrowser,
  getTestName: getTestName,
  getSnapshotName: getSnapshotName,

  allTests: allTests,
};
