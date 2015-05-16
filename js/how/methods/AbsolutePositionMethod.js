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
          'Horizontally right aligned',
          c.checkHorizontalAlignment(Options.HorizontalAlignment.RIGHT)
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
          'Vertically bottom aligned',
          c.checkVerticalAlignment(Options.VerticalAlignment.BOTTOM)
        ),
      ]),
    ]);
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Array<Options.BrowserSupport>
  ): ReactElement {
    var parentStyles = {};
    parentStyles.position = 'relative';
    var childStyles = {};
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

    if (contentWidth) {
      childStyles.width = contentWidth.toString();
    }
    if (contentHeight) {
      childStyles.height = contentHeight.toString();
    }

    var containerWidth = container.width;
    var containerHeight = container.height;
    if (containerWidth) {
      parentStyles.width = containerWidth.toString();
    }
    if (containerHeight) {
      parentStyles.height = containerHeight.toString();
    }

    var child;
    if (content.text) {
      // TODO have to wrap the text in an inner div and extend it to 100% width
      // in order to center or right align.
      child = this.getTextContent();
    } else {
      child = <div style={childStyles} />;
    }
    return (
      <div style={parentStyles}>
        {child}
      </div>
    );
  }
}

module.exports = AbsolutePositionMethod;
