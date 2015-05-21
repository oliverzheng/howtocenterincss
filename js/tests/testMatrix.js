/* @flow */

var invariant = require('invariant');
var Combinatorics = require('js-combinatorics').Combinatorics;
var Options = require('../how/Options');

var FONT_SIZE = 30; // px
var fontSizeLength = Options.Length.px(FONT_SIZE);

var contents: Array<Options.Content> = [
  Options.Content.text(fontSizeLength, 1, null),
];

var containers: Array<Options.Container> = [
  new Options.Container(Options.Length.px(200), Options.Length.px(200)),
];

class SeleniumBrowser {
  browserName: string;
  platform: ?string;
  version: ?string;

  constructor(browserName: string, platform: ?string, version: ?string) {
    this.browserName = browserName;
    this.platform = platform;
    this.version = version;
  }

  // Purposely mixed type. It should be opaque to the caller.
  toSeleniumJSON(): mixed {
    return {
      browserName: this.browserName,
      platform: this.platform,
      version: this.version,
    }
  }

  getDisplayName(): string {
    var name = this.browserName;
    if (this.version) {
      name += ' ' + this.version;
    }
    if (this.platform) {
      name += ' on ' + this.platform;
    }
    return name;
  }

  static ie11OnWindows7: SeleniumBrowser;
  static ie10OnWindows7: SeleniumBrowser;
  static ie9OnWindows7: SeleniumBrowser;
  static ie8OnWindowsXP: SeleniumBrowser;
  static ie7OnWindowsXP: SeleniumBrowser;
  static ie6OnWindowsXP: SeleniumBrowser;
  static chromeOnWindows8: SeleniumBrowser;
  static firefoxOnWindows8: SeleniumBrowser;
  static chrome: SeleniumBrowser;
  static firefox: SeleniumBrowser;
}

SeleniumBrowser.ie11OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '11');
SeleniumBrowser.ie10OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '10');
SeleniumBrowser.ie9OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '9');
SeleniumBrowser.ie8OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '8');
SeleniumBrowser.ie7OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '7');
SeleniumBrowser.ie6OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '6');
SeleniumBrowser.chromeOnWindows8 = new SeleniumBrowser('chrome', 'Windows 8', null);
SeleniumBrowser.firefoxOnWindows8 = new SeleniumBrowser('firefox', 'Windows 8', null);
SeleniumBrowser.chrome = new SeleniumBrowser('chrome', null, null);
SeleniumBrowser.firefox = new SeleniumBrowser('firefox', null, null);

class SeleniumBrowserMapping {
  browser: ?Options.Browser;
  seleniumBrowsers: Array<SeleniumBrowser>;

  constructor(
    browser: ?Options.Browser,
    seleniumBrowsers: Array<SeleniumBrowser>
  ) {
    this.browser = browser;
    this.seleniumBrowsers = seleniumBrowsers;
  }

  getSeleniumBrowsersForBrowserSupport(
    browserSupport: Options.BrowserSupport
  ): Array<SeleniumBrowser> {
    return this.seleniumBrowsers.filter(seleniumBrowser => {
      // Run tests on browsers if it's not possible to specify support for it
      if (!this.browser) {
        return true;
      }

      var seleniumBrowserVersion = seleniumBrowser.version;
      if (!seleniumBrowserVersion) {
        return true;
      }

      var browserVersion = new Options.BrowserVersionRequired(
        this.browser,
        seleniumBrowserVersion
      );
      return browserSupport.requiresBrowserVersion(browserVersion);
    });
  }
};

var sauceLabsBrowserMappings: Array<SeleniumBrowserMapping> = [
  new SeleniumBrowserMapping(
    Options.Browser.IE,
    [
      SeleniumBrowser.ie11OnWindows7,
      SeleniumBrowser.ie10OnWindows7,
      SeleniumBrowser.ie9OnWindows7,
      SeleniumBrowser.ie8OnWindowsXP,
      SeleniumBrowser.ie7OnWindowsXP,
      SeleniumBrowser.ie6OnWindowsXP,
    ]
  ),
  new SeleniumBrowserMapping(
    null,
    [
      SeleniumBrowser.chromeOnWindows8,
      SeleniumBrowser.firefoxOnWindows8,
    ]
  ),
];

var localBrowserMappings: Array<SeleniumBrowserMapping> = [
  new SeleniumBrowserMapping(
    null,
    [
      SeleniumBrowser.firefox,
    ]
  ),
];

function generateSeleniumBrowsers(
  browserMappings: Array<SeleniumBrowserMapping>,
  browserSupport: Options.BrowserSupport
): Array<SeleniumBrowser> {
  var browsers: Array<SeleniumBrowser> = [];
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
  enumerateAllBrowserSupports: bool
): Array<Test> {
  var browserSupports: Array<Options.BrowserSupport> = [];
  if (enumerateAllBrowserSupports) {
    browserSupports = Options.BrowserSupport.generateAllBrowserSupports();
  } else {
    browserSupports = [new Options.BrowserSupport([])];
  }
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
  seleniumBrowser: SeleniumBrowser;
  tests: Array<Test>;
};

function generateTestsForSeleniumBrowsers(
  browserMappings: Array<SeleniumBrowserMapping>,
  enumerateAllBrowserSupports: bool
): Array<SeleniumTests> {
  var tests = generateTests(enumerateAllBrowserSupports);
  var seleniumTestsByName: {[key: string]: Array<Test>} = {};
  var seleniumBrowsersByName: {[key: string]: SeleniumBrowser} = {};
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

  var name = getSnapshotName(test) + ' ';

  if (!browserSupport || browserSupport.browserVersionsRequired.length === 0) {
    name += 'support all browsers';
  } else {
    name += browserSupport.browserVersionsRequired.map(
      browserVersionRequired => {
        return browserVersionRequired.browser.shortName + ' minVer=' + browserVersionRequired.minVersion;
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
      name += content.text.fontSize.toString() + '_fontSize_';
    }
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
  SeleniumBrowser: SeleniumBrowser,

  sauceLabsBrowserMappings: sauceLabsBrowserMappings,
  localBrowserMappings: localBrowserMappings,
  getTestName: getTestName,
  getSnapshotName: getSnapshotName,

  generateTestsForSeleniumBrowsers: generateTestsForSeleniumBrowsers,

  fontSize: FONT_SIZE,
};
