/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class MarginAutoMethod extends Method {

  getName(): string {
    return 'Margin auto';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'Not text',
        c.checkContentNotText
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
    var child = this.getContentWithDOM(content);
    var childStyles = child.props.style;

    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      childStyles.marginLeft = 'auto';
      childStyles.marginRight = 'auto';
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      childStyles.marginLeft = 'auto';
    }

    var parent = <div>{child}</div>;
    return { parent: parent, middle: null, child: child };
  }
}

module.exports = MarginAutoMethod;
