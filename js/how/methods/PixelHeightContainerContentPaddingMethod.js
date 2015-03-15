/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');

var invariant = require('invariant');

var c = require('../checks');

class PixelHeightContainerContentPaddingMethod extends Method {

  getName(): string {
    return 'Content and container have known pixel heights; use padding for alignment';
  }

  getRequirements(): Array<Requirement> {
    return [
      new Requirement(
        'Container height is known in pixels',
        c.checkContainer(c.requireHeight(c.requireIsPixel))
      ),
      new Requirement(
        'Content height is known in pixels',
        c.checkContent(c.requireHeight(c.requireIsPixel))
      ),
    ];
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment
  ): ReactElement {
    var containerHeight = container.height;
    invariant(containerHeight, 'Require container height');
    var contentHeight = content.height;
    invariant(contentHeight, 'Require content height');

    var parentStyles = {};
    parentStyles.height = containerHeight.toString();

    var heightDiff = containerHeight.subtract(contentHeight);
    if (verticalAlignment !== Options.VerticalAlignment.TOP) {
      var paddingTop;
      if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
        paddingTop = heightDiff.multiply(0.5);
      } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
        paddingTop = heightDiff;
      }
      parentStyles.paddingTop = paddingTop.toString();
    }


    var child;
    if (content.text) {
      child = this.getTextContent();
      if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
        parentStyles.textAlign = 'center';
      } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
        parentStyles.textAlign = 'right';
      }
    } else {
      var childStyles = {};
      childStyles.height = contentHeight.toString();
      if (horizontalAlignment !== Options.HorizontalAlignment.LEFT) {
        childStyles.marginLeft = 'auto';
        if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
          childStyles.marginRight = 'auto';
        }
      }
      child = <div style={childStyles} />;
    }
    return (
      <div style={parentStyles}>
        {child}
      </div>
    );
  }
}

module.exports = PixelHeightContainerContentPaddingMethod;
