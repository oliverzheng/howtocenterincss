/* @flow */

var Options = require('../Options');
var Requirement = require('./Requirement');

var React = require('react');
var html = require('html');

// Takem from React.js
var _uppercasePattern = /([A-Z])/g;
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}
function createMarkupForStyles(styles) {
  var styleList = [];
  var styleNames = Object.keys(styles);
  // Be consistent
  styleNames.sort();
  styleNames.forEach((styleName) => {
    var styleValue = styles[styleName];
    if (styleValue != null) {
      styleList.push(hyphenate(styleName) + ': ' + styleValue + ';');
    }
  });
  return styleList.join('\n');
}

class Method {
  _addIDs: bool;
  _isTest: bool;

  getName(): string {
    throw new Error('Must implement method');
  }

  getRequirement(): Requirement {
    throw new Error('Must implement method');
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): { parent: ReactElement; middle: ?ReactElement; child: mixed; } {
    throw new Error('Must implement method');
  }

  getCodeElementWithStyles(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): { parent: ReactElement; middle: ?ReactElement; child: mixed; } {
    var {parent, middle, child} = this.getCodeElement(
      content,
      container,
      horizontalAlignment,
      verticalAlignment,
      browserSupport
    );
    this._applyDimensions(
      parent.props,
      container.width,
      container.height,
      this._addIDs ? 'container' : null
    );
    if (middle) {
      this._applyDimensions(
        middle.props,
        null,
        null,
        this._addIDs ? 'middle' : null
      );
    }
    var propsForFonts;
    if (React.isValidElement(child)) {
      var props = (child: any).props;
      this._applyDimensions(
        props,
        content.width,
        content.height,
        this._addIDs ? 'content' : null
      );
      propsForFonts = props;
    } else {
      // It's a fragment
      propsForFonts = parent.props;
    }
    this._applyFontStyles(propsForFonts, content);
    return { parent, middle, child };
  }

  getCode(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): string {
    var {parent, middle, child} = this.getCodeElementWithStyles(
      content,
      container,
      horizontalAlignment,
      verticalAlignment,
      browserSupport
    );
    var code = React.renderToStaticMarkup(parent);
    var formattedCode = html.prettyPrint(
      code,
      {
        indent_size: 2,
        max_char: 50,
      }
    );
    return formattedCode;
  }

  getCanonicalCode(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): { html: string; parentCSS: string; middleCSS: string; childCSS: string; } {
    var {parent, middle, child} = this.getCodeElementWithStyles(
      content,
      container,
      horizontalAlignment,
      verticalAlignment,
      browserSupport
    );

    var parentStyles = parent.props.style;
    parent.props.style = null;

    var childStyles = {};
    if (React.isValidElement(child)) {
      childStyles = (child: any).props.style;
      (child: any).props.style = null;
    }

    var middleStyles = {};
    if (middle) {
      middleStyles = middle.props.style;
      middle.props.style = null;
    }

    var code = React.renderToStaticMarkup(parent);
    var formattedCode = html.prettyPrint(
      code,
      {
        indent_size: 2,
        max_char: 50,
      }
    );

    return {
      html: formattedCode,
      parentCSS: createMarkupForStyles(parentStyles),
      middleCSS: createMarkupForStyles(middleStyles),
      childCSS: createMarkupForStyles(childStyles),
    };
  }

  _applyDimensions(
    props: { style: ?{[key: string]: string}; id: ?string },
    width: ?Options.Length,
    height: ?Options.Length,
    id: ?string
  ) {
    var styles = props.style;
    if (!styles) {
      styles = props.style = {};
    }
    if (!styles.width && width) {
      styles.width = width.toString();
    }
    if (!styles.height && height) {
      styles.height = height.toString();
    }
    if (id) {
      props.id = id;
    }
  }

  _applyFontStyles(
    props: { style: ?{[key: string]: string}; },
    content: Options.Content
  ) {
    var styles = props.style;
    if (!styles) {
      styles = props.style = {};
    }
    var text = content.text;
    if (!styles.fontSize && text && text.fontSize) {
      styles.fontSize = text.fontSize.toString();
    }
  }

  addIDs(): void {
    this._addIDs = true;
  }

  setIsTest(): void {
    this._isTest = true;
  }

  getContent(content: Options.Content): mixed {
    if (content.text) {
      return this.getText();
    } else {
      return <div />;
    }
  }

  getContentWithDOM(
    content: Options.Content,
    requireBlock: bool = false
  ): ReactElement {
    // Add styles, since that's why the caller wants a DOM element
    var styles = {};
    if (content.text) {
      var text = this.getText();
      if (requireBlock) {
        return <div style={styles}>{text}</div>;
      } else {
        return <span style={styles}>{text}</span>;
      }
    } else {
      return <div style={styles} />;
    }
  }

  getText(): string {
    var str = 'Text Content';
    if (this._isTest) {
      // TODO rename addIDs to "isTest" or something
      // This 'I' has the least variance in font rendering. Even if the fonts
      // shift up and down, the majority of the text still occupy the same
      // space. Only 1 character is used, because Windows and Mac render the
      // same text with different spacing.
      // See http://fmforums.com/forum/topic/79795-cross-platform-fonts-revisited-arial-vs-verdana/
      str = 'I';
    }
    return str;
  }
}

module.exports = Method;
