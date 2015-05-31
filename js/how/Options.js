/* @flow */

var invariant = require('invariant');

class LengthType {
  cssUnit: string;
  filenameUnit: string;

  static PIXEL: LengthType;
  static PERCENTAGE: LengthType;
  static EM: LengthType;
  static AllTypes: Array<LengthType>;

  constructor(cssUnit: string, filenameUnit: ?string = null) {
    this.cssUnit = cssUnit;
    this.filenameUnit = filenameUnit || cssUnit;
  }

  toString(): string {
    return this.cssUnit;
  }

  toFilenameString(): string {
    return this.filenameUnit;
  }
}

LengthType.PIXEL = new LengthType('px');
LengthType.PERCENTAGE = new LengthType('%', 'pct');
LengthType.EM = new LengthType('em');

LengthType.AllTypes = [
  LengthType.PIXEL,
  LengthType.PERCENTAGE,
  LengthType.EM,
];

class Length {
  value: number;
  lengthType: LengthType;

  constructor(value: number, lengthType: LengthType) {
    this.value = value;
    this.lengthType = lengthType;
  }

  multiply(multiplier: number): Length {
    return new Length(this.value * multiplier, this.lengthType);
  }

  add(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value + length.value, this.lengthType);
  }

  subtract(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value - length.value, this.lengthType);
  }

  toString(): string {
    return this.value.toString() + this.lengthType.toString();
  }

  toFilenameString(): string {
    return this.value.toString() + this.lengthType.toFilenameString();
  }

  static px(value: number): Length {
    return new Length(value, LengthType.PIXEL);
  }

  static pct(value: number): Length {
    return new Length(value, LengthType.PERCENTAGE);
  }

  static em(value: number): Length {
    return new Length(value, LengthType.EM);
  }
}

// The outer parent container is always of block container. It makes no sense to
// center within an inline container - the container would just shrink to the
// width of the content.
//
// The inner container is either inline-block or block. If a paragraph of text
// is to be centered, it should be put into an inline-block first.
class Text {
  fontSize: ?Length;
  lines: ?number;
  lineHeight: ?Length;

  constructor(fontSize: ?Length, lines: ?number, lineHeight: ?Length) {
    this.fontSize = fontSize;
    this.lines = lines;
    this.lineHeight = lineHeight;
  }
}

class Content {
  width: ?Length;
  height: ?Length;
  text: ?Text;

  constructor(width: ?Length, height: ?Length, text: ?Text) {
    this.width = width;
    this.height = height;
    this.text = text;
  }

  static text(fontSize: ?Length, lines: ?number, lineHeight: ?Length): Content {
    var height = null;
    if (lines === 1 && fontSize) {
      height = new Length(fontSize.value, fontSize.lengthType);
    } else if (lines && lines > 1 && lineHeight) {
      height = new Length(lineHeight.value * lines, lineHeight.lengthType);
    }
    return new Content(null, height, new Text(fontSize, lines, lineHeight));
  }
}

class Container {
  width: ?Length;
  height: ?Length;

  constructor(width: ?Length, height: ?Length) {
    this.width = width;
    this.height = height;
  }
}

class HorizontalAlignment {
  static LEFT: HorizontalAlignment;
  static CENTER: HorizontalAlignment;
  static RIGHT: HorizontalAlignment;
}
HorizontalAlignment.LEFT = new HorizontalAlignment();
HorizontalAlignment.CENTER = new HorizontalAlignment();
HorizontalAlignment.RIGHT = new HorizontalAlignment();

class VerticalAlignment {
  static TOP: VerticalAlignment;
  static MIDDLE: VerticalAlignment;
  static BOTTOM: VerticalAlignment;
}
VerticalAlignment.TOP = new VerticalAlignment();
VerticalAlignment.MIDDLE = new VerticalAlignment();
VerticalAlignment.BOTTOM = new VerticalAlignment();


class Browser {
  name: string;
  shortName: string;
  versions: Array<string>;

  constructor(name: string, shortName: string, versions: Array<string>) {
    this.name = name;
    this.shortName = shortName;
    this.versions = versions;
  }

  static IE: Browser;
  static AllBrowsers: Array<Browser>;
}
Browser.IE = new Browser(
  'Internet Explorer',
  'IE',
  [
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
  ]
);
Browser.AllBrowsers = [
  Browser.IE,
];

class BrowserVersionRequired {
  browser: Browser;
  minVersion: ?string;

  constructor(browser: Browser, minVersion: ?string) {
    if (minVersion) {
      invariant(
        browser.versions.indexOf(minVersion) != -1,
        'Invalid version %s for browser %s',
        minVersion,
        browser.name
      );
    }

    this.browser = browser;
    this.minVersion = minVersion;
  }

  getVersionsNeededForSupport(): Array<string> {
    if (!this.minVersion) {
      return [];
    }

    var requiredSupportIndex = this.browser.versions.indexOf(
      this.minVersion
    );
    return this.browser.versions.slice(requiredSupportIndex);
  }

  // Does this browser version requirement imply requiring a later version?
  requiresBrowserVersion(other: BrowserVersionRequired): bool {
    var otherMinVersion = other.minVersion;
    if (!otherMinVersion) {
      return true;
    }

    if (!this.minVersion) {
      return false;
    }

    invariant(other.browser === this.browser, 'Must compare the same browser');
    var versions = this.browser.versions;
    return versions.indexOf(this.minVersion) <= versions.indexOf(otherMinVersion);
  }

  static generateAllBrowserVersionsRequired(browser: Browser): Array<BrowserVersionRequired> {
    var requireds = browser.versions.map(
      version => new BrowserVersionRequired(browser, version)
    );
    requireds.unshift(new BrowserVersionRequired(browser, null));
    return requireds;
  }
}

class BrowserSupport {
  browserVersionsRequired: Array<BrowserVersionRequired>;

  constructor(browserVersionsRequired: Array<BrowserVersionRequired>) {
    this.browserVersionsRequired = browserVersionsRequired;
  }

  // It is assumed that we support a browser if it's not specified.
  requiresBrowserVersion(browserVersion: BrowserVersionRequired): bool {
    return this.browserVersionsRequired.every(b => {
      if (b.browser !== browserVersion.browser) {
        return true;
      }
      return b.requiresBrowserVersion(browserVersion);
    });
  }

  addBrowserVersionRequired(required: BrowserVersionRequired) {
    this.removeBrowserRequired(required.browser);
    this.browserVersionsRequired.push(required);
  }

  removeBrowserRequired(browser: Browser) {
    for (var i = 0; i < this.browserVersionsRequired.length; ++i) {
      var required = this.browserVersionsRequired[i];
      if (required.browser === browser) {
        this.browserVersionsRequired.splice(i, 1);
        return;
      }
    }
  }

  // If every one of the required versions here is required by another
  requiresBrowserSupport(other: BrowserSupport): bool {
    return other.browserVersionsRequired.every(
      browserVersion => this.requiresBrowserVersion(browserVersion)
    );
  }

  static generateAllBrowserSupports(): Array<BrowserSupport> {
    // TODO Only care about IE for now
    var versionsRequired = BrowserVersionRequired.generateAllBrowserVersionsRequired(Browser.IE)
    var supports = versionsRequired.map(versionRequired => new BrowserSupport([versionRequired]));
    // We want a catch all
    supports.push(new BrowserSupport([]));
    return supports;
  }
}

module.exports = {
  Length,
  LengthType,
  HorizontalAlignment,
  VerticalAlignment,
  Content,
  Container,
  Text,
  Browser,
  BrowserVersionRequired,
  BrowserSupport,
};
