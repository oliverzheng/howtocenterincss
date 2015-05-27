/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class TextAlignMethod extends Method {

  getName(): string {
    return 'Text align';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'Is text',
        c.checkContentIsText
      ),
      new Requirement(
        'Vertically top aligned',
        c.checkVerticalAlignment(Options.VerticalAlignment.TOP)
      ),
      new Requirement(
        'Horizontally center or right aligned',
        c.checkAnyHorizontalAlignment([
          Options.HorizontalAlignment.CENTER,
          Options.HorizontalAlignment.RIGHT,
        ])
      ),
    ]);
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): { parent: ReactElement; middle: ?ReactElement; child: mixed; } {
    var parentStyles = {};

    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      parentStyles.textAlign = 'center';
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      parentStyles.textAlign = 'right';
    }

    var child = this.getContent(content);
    var parent = <div style={parentStyles}>{child}</div>;
    return { parent: parent, middle: null, child: child };
  }
}

module.exports = TextAlignMethod;
