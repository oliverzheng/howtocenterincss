/* @flow */

var Options = require('../Options');
var Requirement = require('./Requirement');

var React = require('react');
var html = require('html');

class Method {
  _addIDs: bool;

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
    browserSupport: Array<Options.BrowserSupport>
  ): ReactElement {
    throw new Error('Must implement method');
  }

  getCode(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Array<Options.BrowserSupport>
  ): string {
    var element = this.getCodeElement(
      content,
      container,
      horizontalAlignment,
      verticalAlignment,
      browserSupport
    );
    var styles = element.props.style;
    if (!styles) {
      styles = element.props.style = {};
    }
    if (!styles.width && container.width) {
      styles.width = container.width.toString();
    }
    if (!styles.height && container.height) {
      styles.height = container.height.toString();
    }
    if (this._addIDs) {
      element = React.cloneElement(
        element,
        {id: 'container'}
      );
    }
    var code = React.renderToStaticMarkup(element);
    var formattedCode = html.prettyPrint(
      code,
      {
        indent_size: 2,
        max_char: 50,
      }
    );
    return formattedCode;
  }

  addIDs(): void {
    this._addIDs = true;
  }

  getContent(): ?ReactElement {
    var content = <div />;
    if (this._addIDs) {
      content.setProps({id: 'content'});
    }
    return content;
  }

  getTextContent(): mixed {
    if (this._addIDs) {
      // TODO rename addIDs to "isTest" or something
      // These IIs have the least variance in font rendering. Even if the fonts
      // shift up and down, the majority of the text still occupy the same
      // space.
      return 'IIIIII';
    }
    return 'Text Content';
  }
}

module.exports = Method;
