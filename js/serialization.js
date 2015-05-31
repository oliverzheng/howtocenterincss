/** @flow */

var Options = require('./how/Options');

function serializeLength(length: Options.Length): mixed {
  return length.toFilenameString();
}

function deserializeLength(serialized: string): ?Options.Length {
  var number = parseInt(serialized, 10);
  var unitSerialized = serialized.replace(/\d*/, '');
  var unit;
  if (unitSerialized === Options.LengthType.PIXEL.toFilenameString()) {
    unit = Options.LengthType.PIXEL;
  } else if (unitSerialized === Options.LengthType.PERCENTAGE.toFilenameString()) {
    unit = Options.LengthType.PERCENTAGE;
  } else if (unitSerialized === Options.LengthType.EM.toFilenameString()) {
    unit = Options.LengthType.EM;
  }

  if (!unit || isNaN(number)) {
    return null;
  }

  return new Options.Length(number, unit);
}

function serializeOptions(
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
): mixed {
  var contentSerial = {};

  var contentType;
  var contentText = content.text;
  if (contentText) {
    contentType = 'text';

    contentSerial.text = {};

    if (contentText.fontSize) {
      contentSerial.text.fontSize = serializeLength(contentText.fontSize);
    }

    if (contentText.lines) {
      contentSerial.text.lines = contentText.lines;
    }

    if (contentText.lineHeight) {
      contentSerial.text.lineHeight = serializeLength(contentText.lineHeight);
    }

  } else {
    contentType = 'div';

    if (content.width) {
      contentSerial.width = serializeLength(content.width);
    }

    if (content.height) {
      contentSerial.height = serializeLength(content.height);
    }
  }

  var containerSerial = {};

  if (container.width) {
    containerSerial.width = serializeLength(container.width);
  }

  if (container.height) {
    containerSerial.height = serializeLength(container.height);
  }

  var horizontalSerial;
  if (horizontalAlignment === Options.HorizontalAlignment.LEFT) {
    horizontalSerial = 'left';
  } else if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
    horizontalSerial = 'center';
  } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
    horizontalSerial = 'right';
  }

  var verticalSerial;
  if (verticalAlignment === Options.VerticalAlignment.TOP) {
    verticalSerial = 'top';
  } else if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
    verticalSerial = 'middle';
  } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
    verticalSerial = 'bottom';
  }

  var browserSupportSerial = {};
  browserSupport.browserVersionsRequired.forEach(browserVersion => {
    browserSupportSerial[browserVersion.browser.shortName] =
      browserVersion.minVersion || 'none';
  });

  return {
    contentType,
    content: contentSerial,
    container: containerSerial,
    horizontal: horizontalSerial,
    vertical: verticalSerial,
    browser: browserSupportSerial,
  };
}

function deserializeOptions(serialized: any): ?{
  content: Options.Content;
  container: Options.Container;
  horizontalAlignment: Options.HorizontalAlignment;
  verticalAlignment: Options.VerticalAlignment;
  browserSupport: Options.BrowserSupport;
} {
  var contentTypeSerial = serialized.contentType;
  var contentSerial = serialized.content;
  var content;
  if (contentTypeSerial === 'text') {
    var fontSize;
    var lines;
    var lineHeight;

    var contentTextSerial = contentSerial && contentSerial.text;
    if (contentTextSerial) {
      var fontSizeSerial = contentTextSerial.fontSize;
      if (fontSizeSerial) {
        fontSize = deserializeLength(fontSizeSerial);
      }

      var linesSerial = contentTextSerial.lines;
      if (linesSerial) {
        lines = parseInt(linesSerial, 10) || null;
      }

      var lineHeightSerial = contentTextSerial.lineHeight;
      if (lineHeightSerial) {
        lineHeight = deserializeLength(lineHeightSerial);
      }
    }

    content = Options.Content.text(fontSize, lines, lineHeight);

  } else if (contentTypeSerial === 'div') {
    var contentWidthSerial = contentSerial && contentSerial.width;
    var width;
    if (contentWidthSerial) {
      width = deserializeLength(contentWidthSerial);
    }

    var contentHeightSerial = contentSerial && contentSerial.height;
    var height;
    if (contentHeightSerial) {
      height = deserializeLength(contentHeightSerial);
    }

    content = new Options.Content(width, height, null);
  }

  var containerSerial = serialized.container;
  var container;
  if (containerSerial) {
    var containerWidthSerial = containerSerial.width;
    var width;
    if (containerWidthSerial) {
      width = deserializeLength(containerWidthSerial);
    }

    var containerHeightSerial = containerSerial.height;
    var height;
    if (containerHeightSerial) {
      height = deserializeLength(containerHeightSerial);
    }

    container = new Options.Container(width, height);
  }
  if (!container) {
    container = new Options.Container(null, null, null);
  }

  var horizontalSerial = serialized.horizontal;
  var horizontalAlignment;
  if (horizontalSerial === 'left') {
    horizontalAlignment = Options.HorizontalAlignment.LEFT;
  } else if (horizontalSerial === 'center') {
    horizontalAlignment = Options.HorizontalAlignment.CENTER;
  } else if (horizontalSerial === 'right') {
    horizontalAlignment = Options.HorizontalAlignment.RIGHT;
  }

  var verticalSerial = serialized.vertical;
  var verticalAlignment;
  if (verticalSerial === 'top') {
    verticalAlignment = Options.VerticalAlignment.TOP;
  } else if (verticalSerial === 'middle') {
    verticalAlignment = Options.VerticalAlignment.MIDDLE;
  } else if (verticalSerial === 'bottom') {
    verticalAlignment = Options.VerticalAlignment.BOTTOM;
  }

  var browserSerial = serialized.browser;
  var browserSupport;
  if (browserSerial) {
    var browserVersions: Array<Options.BrowserVersionRequired> = [];
    Object.keys(browserSerial).forEach((browserShortName) => {
      var browser = Options.Browser.AllBrowsers.filter(
        (browser) => browser.shortName === browserShortName
      )[0];
      if (browser) {
        var version = browserSerial[browserShortName];
        if (version === 'none') {
          version = null;
        }
        browserVersions.push(
          new Options.BrowserVersionRequired(browser, version)
        );
      }
    });
    browserSupport = new Options.BrowserSupport(browserVersions);
  } else {
    browserSupport = new Options.BrowserSupport([]);
  }

  if (!content || !container || !horizontalAlignment || !verticalAlignment) {
    return null;
  }

  return {
    content,
    container,
    horizontalAlignment,
    verticalAlignment,
    browserSupport,
  };
}

module.exports = {
  serializeOptions,
  deserializeOptions,
}
