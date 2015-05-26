/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class PixelHeightContainerContentPaddingMethod extends Method {

  getName(): string {
    return 'Content and container have known pixel heights; use padding for alignment';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'Container height is known in pixels',
        c.checkContainer(c.requireHeight(c.requireIsPixel))
      ),
      new Requirement(
        'Content height is known in pixels',
        c.checkContent(c.requireHeight(c.requireIsPixel))
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
    var containerHeight = container.height;
    invariant(containerHeight, 'Require container height');
    var contentHeight = content.height;
    invariant(contentHeight, 'Require content height');

    var parentStyles = {};

    var heightDiff = containerHeight.subtract(contentHeight);
    if (verticalAlignment !== Options.VerticalAlignment.TOP) {
      var paddingTop;
      if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
        paddingTop = heightDiff.multiply(0.5);
      } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
        paddingTop = heightDiff;
      }
      invariant(paddingTop, 'typechecker');
      parentStyles.paddingTop = paddingTop.toString();

      var parentHeight = containerHeight.subtract(paddingTop);
      parentStyles.height = parentHeight.toString();
    }

    var child;
    if (content.text) {
      child = this.getContent(content);
      if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
        parentStyles.textAlign = 'center';
      } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
        parentStyles.textAlign = 'right';
      }
    } else {
      child = this.getContentWithDOM(content);
      var childStyles = child.props.style;
      if (horizontalAlignment !== Options.HorizontalAlignment.LEFT) {
        childStyles.marginLeft = 'auto';
        if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
          childStyles.marginRight = 'auto';
        }
      }
    }
    var parent =
      <div style={parentStyles}>
        {child}
      </div>;
    return { parent: parent, middle: null, child: child };
  }
}

module.exports = PixelHeightContainerContentPaddingMethod;
