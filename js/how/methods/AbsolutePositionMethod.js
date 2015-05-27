/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class AbsolutePositionMethod extends Method {

  getName(): string {
    return 'Absolute position the content';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      Requirement.any([
        Requirement.all([
          new Requirement(
            'Content width is known',
            c.checkContent(c.requireWidthExists)
          ),
          new Requirement(
            'Horizontally center aligned',
            c.checkHorizontalAlignment(Options.HorizontalAlignment.CENTER)
          ),
        ]),
        new Requirement(
          'Horizontally left or right aligned',
          c.checkAnyHorizontalAlignment([
            Options.HorizontalAlignment.LEFT,
            Options.HorizontalAlignment.RIGHT,
          ])
        ),
      ]),
      Requirement.any([
        Requirement.all([
          new Requirement(
            'Content height is known',
            c.checkContent(c.requireHeightExists)
          ),
          new Requirement(
            'Vertically center aligned',
            c.checkVerticalAlignment(Options.VerticalAlignment.MIDDLE)
          ),
        ]),
        new Requirement(
          'Vertically top or bottom aligned',
          c.checkAnyVerticalAlignment([
            Options.VerticalAlignment.TOP,
            Options.VerticalAlignment.BOTTOM,
          ])
        ),
      ]),
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
    parentStyles.position = 'relative';

    var child = this.getContentWithDOM(content, true /*requireBlock*/);

    var childStyles = child.props.style;
    if (!childStyles) {
      childStyles = child.props.style = {};
    }
    childStyles.position = 'absolute';

    var contentWidth = content.width;
    var contentHeight = content.height;
    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      invariant(contentWidth, 'Require content width');
      childStyles.left = '50%';
      childStyles.marginLeft = contentWidth.multiply(-0.5).toString();
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      childStyles.right = '0';
    }

    if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
      invariant(contentHeight, 'Require content height');
      childStyles.top = '50%';
      childStyles.marginTop = contentHeight.multiply(-0.5).toString();
    } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
      childStyles.bottom = '0';
    }

    // TODO have to wrap the text in an inner div and extend it to 100% width
    // in order to center or right align.

    var parent =
      <div style={parentStyles}>
        {child}
      </div>;
    return { parent: parent, middle: null, child: child };
  }
}

module.exports = AbsolutePositionMethod;
