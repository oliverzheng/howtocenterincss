/* @flow */

var Options = require('../how/Options');

class SeleniumBrowser {
  browserName: string;
  platform: ?string;
  version: ?string;
  startingPage: string;

  constructor(browserName: string, platform: ?string, version: ?string, startingPage: string) {
    this.browserName = browserName;
    this.platform = platform;
    this.version = version;
    this.startingPage = startingPage;
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

// Piece of junk IE adds a 3D border around body that cannot be removed unless
// the HTML has a doctype as such:
// http://stackoverflow.com/questions/3923075/how-to-remove-3d-border-in-ie8-with-doctype-xhtml
// JS can't modify the doctype at runtime, and selenium can't open a page with
// specified HTML, so we have to have a page with the doctype set already.
var HTML_DOCTYPE = 'http://dump.oliverzheng.com/doctype_html.html';
var HTML_ABOUT_BLANK = 'about:blank';

SeleniumBrowser.ie11OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '11', HTML_ABOUT_BLANK);
SeleniumBrowser.ie10OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '10', HTML_ABOUT_BLANK);
SeleniumBrowser.ie9OnWindows7 = new SeleniumBrowser('internet explorer', 'Windows 7', '9', HTML_DOCTYPE);
SeleniumBrowser.ie8OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '8', HTML_DOCTYPE);
SeleniumBrowser.ie7OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '7', HTML_DOCTYPE);
SeleniumBrowser.ie6OnWindowsXP = new SeleniumBrowser('internet explorer', 'Windows XP', '6', HTML_DOCTYPE);
SeleniumBrowser.chromeOnWindows8 = new SeleniumBrowser('chrome', 'Windows 8', null, HTML_ABOUT_BLANK);
SeleniumBrowser.firefoxOnWindows8 = new SeleniumBrowser('firefox', 'Windows 8', null, HTML_ABOUT_BLANK);
SeleniumBrowser.chrome = new SeleniumBrowser('chrome', null, null, HTML_ABOUT_BLANK);
SeleniumBrowser.firefox = new SeleniumBrowser('firefox', null, null, HTML_ABOUT_BLANK);

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
