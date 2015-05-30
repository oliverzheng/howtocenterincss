/* @flow */

var invariant = require('invariant');
var Combinatorics = require('js-combinatorics');
var Options = require('../how/Options');
var selenium = require('./selenium');

var FONT_SIZE = 30; // px
var fontSizeLength = Options.Length.px(FONT_SIZE);

var contents: Array<Options.Content> = [
  Options.Content.text(fontSizeLength, 1, null),
  new Options.Content(Options.Length.px(20), Options.Length.px(20), null),
  new Options.Content(null, null, null),
];

var containers: Array<Options.Container> = [
  new Options.Container(Options.Length.px(200), Options.Length.px(200)),
  new Options.Container(null, null),
];

function generateSeleniumBrowsers(
  browserMappings: Array<selenium.SeleniumBrowserMapping>,
  browserSupport: Options.BrowserSupport
): Array<selenium.SeleniumBrowser> {
  var browsers: Array<selenium.SeleniumBrowser> = [];
  browserMappings.forEach(mapping => {
    browsers.push.apply(
      browsers,
      mapping.getSeleniumBrowsersForBrowserSupport(browserSupport)
    );
  });
  return browsers;
}

type Test = {
  content: Options.Content;
  container: Options.Container;
  horizontal: Options.HorizontalAlignment;
  vertical: Options.VerticalAlignment;
  browserSupport: Options.BrowserSupport;
};

function generateTests(
): Array<Test> {
  var browserSupports: Array<Options.BrowserSupport> =
    Options.BrowserSupport.generateAllBrowserSupports();
  return Combinatorics.cartesianProduct(
    contents,
    containers,
    [Options.HorizontalAlignment.LEFT, Options.HorizontalAlignment.CENTER, Options.HorizontalAlignment.RIGHT], 
    [Options.VerticalAlignment.TOP, Options.VerticalAlignment.MIDDLE, Options.VerticalAlignment.BOTTOM], 
    browserSupports
  ).toArray().map(test => {
    return {
      content: test[0],
      container: test[1],
      horizontal: test[2],
      vertical: test[3],
      browserSupport: test[4],
    }
  });
}

type SeleniumTests = {
  seleniumBrowser: selenium.SeleniumBrowser;
  tests: Array<Test>;
};

function generateTestsForSeleniumBrowsers(
  browserMappings: Array<selenium.SeleniumBrowserMapping>
): Array<SeleniumTests> {
  var tests = generateTests();
  var seleniumTestsByName: {[key: string]: Array<Test>} = {};
  var seleniumBrowsersByName: {[key: string]: selenium.SeleniumBrowser} = {};
  tests.forEach(test => {
    var seleniumBrowsers = generateSeleniumBrowsers(
      browserMappings,
      test.browserSupport
    );
    seleniumBrowsers.forEach(seleniumBrowser => {
      var name = seleniumBrowser.getDisplayName();
      if (!seleniumTestsByName.hasOwnProperty(name)) {
        seleniumTestsByName[name] = [];
        seleniumBrowsersByName[name] = seleniumBrowser;
      }

      var seleniumTests = seleniumTestsByName[name];
      seleniumTests.push(test);
    });
  });

  var seleniumTests: Array<SeleniumTests> = [];
  for (var name in seleniumTestsByName) {
    if (seleniumTestsByName.hasOwnProperty(name)) {
      seleniumTests.push({
        seleniumBrowser: seleniumBrowsersByName[name],
        tests: seleniumTestsByName[name],
      });
    }
  }
  return seleniumTests;
}

function getHorizontalText(alignment) {
  if (alignment === Options.HorizontalAlignment.LEFT) {
    return 'left';
  } else if (alignment === Options.HorizontalAlignment.CENTER) {
    return 'center';
  } else if (alignment === Options.HorizontalAlignment.RIGHT) {
    return 'right';
  }
  invariant(false, 'impossibre');
}

function getVerticalText(alignment) {
  if (alignment === Options.VerticalAlignment.TOP) {
    return 'top';
  } else if (alignment === Options.VerticalAlignment.MIDDLE) {
    return 'middle';
  } else if (alignment === Options.VerticalAlignment.BOTTOM) {
    return 'bottom';
  }
  invariant(false, 'impossibre');
}

function getTestName(test: Test): string {
  var {
    content,
    container,
    horizontal,
    vertical,
    browserSupport,
  } = test;

  var name = getSnapshotName(test) + '_';

  if (!browserSupport || browserSupport.browserVersionsRequired.length === 0) {
    name += 'support_all_browsers';
  } else {
    name += browserSupport.browserVersionsRequired.map(
      browserVersionRequired => {
        var name = browserVersionRequired.browser.shortName;
        if (browserVersionRequired.minVersion) {
          name += '_minVer_' + browserVersionRequired.minVersion;
        } else {
          name += '_no-support';
        }
        return name;
      }
    ).join(',');
  }

  return name;
}

function getSnapshotName(test: Test): string {
  var name = '';
  var {
    content,
    container,
    horizontal,
    vertical,
    browserSupport,
  } = test;

  name += 'content_';
  if (content.text) {
    name += 'text_';
    if (content.text.fontSize) {
      name += content.text.fontSize.toFilenameString() + '_fontSize_';
    }
    if (content.text.lines != null) {
      name += content.text.lines + '_lines_';
    }
    if (content.text.lineHeight) {
      name += content.text.lineHeight.toFilenameString() + '_lineHeight_';
    }
  } else {
    name += 'width_';
    if (content.width) {
      name += content.width.toFilenameString() + '_';
    } else {
      name += 'unknown_';
    }

    name += 'height_';
    if (content.height) {
      name += content.height.toFilenameString() + '_';
    } else {
      name += 'unknown_';
    }
  }

  name += 'container_';
  name += 'width_';
  if (container.width) {
    name += container.width.toFilenameString() + '_';
  } else {
    name += 'unknown_';
  }

  name += 'height_';
  if (container.height) {
    name += container.height.toFilenameString() + '_';
  } else {
    name += 'unknown_';
  }

  name += getHorizontalText(horizontal) + '_' + getVerticalText(vertical);

  return name;
}

module.exports = {
  getTestName: getTestName,
  getSnapshotName: getSnapshotName,

  generateTestsForSeleniumBrowsers: generateTestsForSeleniumBrowsers,

  fontSize: FONT_SIZE,
};
