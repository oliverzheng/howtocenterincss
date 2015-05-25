/* @flow */

var Options = require('../how/Options');

class SeleniumBrowser {
  browserName: string;
  platform: ?string;
  version: ?string;
  cropBoundary: {
    addX: number;
    addY: number;
    cropX: number;
    cropY: number;
  };

  constructor(browserName: string, platform: ?string, version: ?string) {
    this.browserName = browserName;
    this.platform = platform;
    this.version = version;
    this.cropBoundary = {
      addX: 0,
      addY: 0,
      cropX: 0,
      cropY: 0,
    };
  }

  hasCropBoundary(): bool {
    return (
      this.cropBoundary.addX !== 0 ||
      this.cropBoundary.addY !== 0 ||
      this.cropBoundary.cropX !== 0 ||
      this.cropBoundary.cropY !== 0
    );
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

// Piece of junk IE adds a 3D border around body that cannot be removed unless
// the HTML has a doctype as such:
// http://stackoverflow.com/questions/3923075/how-to-remove-3d-border-in-ie8-with-doctype-xhtml
// JS can't modify the doctype at runtime, and selenium can't open a page with
// specified HTML. We have to have to crop the screenshot at runtime.
// But it's also buggy how screenshots are taken vs how many pixels of border
// are added, because the x-axis doesn't add up. Somehow, they need twice as
// many pixels to pad. :|
var ieCropBoundary = {
  addX: 8,
  addY: 4,
  cropX: 2,
  cropY: 2,
};
[
  SeleniumBrowser.ie8OnWindowsXP,
  SeleniumBrowser.ie7OnWindowsXP,
  SeleniumBrowser.ie6OnWindowsXP,
].forEach(browser => browser.cropBoundary = ieCropBoundary);

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


module.exports = {
  SeleniumBrowserMapping: SeleniumBrowserMapping,
  SeleniumBrowser: SeleniumBrowser,
  sauceLabsBrowserMappings: sauceLabsBrowserMappings,
  localBrowserMappings: localBrowserMappings,
};
