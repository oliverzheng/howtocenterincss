/* @flow */

var Options = require('../Options');
var Requirement = require('./Requirement');

var React = require('react');
var html = require('html');

class Method {
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
    verticalAlignment: Options.VerticalAlignment
  ): ReactElement {
    throw new Error('Must implement method');
  }

  getCode(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment
  ): string {
    var element = this.getCodeElement(
      content,
      container,
      horizontalAlignment,
      verticalAlignment
    );
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

  getTextContent(): string {
    return 'Text Content';
  }
}

module.exports = Method;
