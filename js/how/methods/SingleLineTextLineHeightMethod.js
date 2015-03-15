/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');

var c = require('../checks');

class SingleLineTextLineHeightMethod extends Method {

  getName(): string {
    return 'Single line text using line height';
  }

  getRequirements(): Array<Requirement> {
    return [
      new Requirement(
        'Container height is set',
        c.checkContainer(c.requireHeightExists)
      ),
      new Requirement(
        'Content has single line of text',
        c.checkContent((content) => content.text && content.text.lines === 1)
      ),
    ];
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment
  ): ReactElement {
    var styles = {};
    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      styles.textAlign = 'center';
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      styles.textAlign = 'right';
    }

    if (verticalAlignment !== Options.VerticalAlignment.TOP) {
      styles.lineHeight = container.height.toString();
      if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
        // Default vertical alignment is middle
      } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
        styles.verticalAlign = 'bottom';
      }
    }
    return (
      <div style={styles}>
        Text
      </div>
    );
  }
}

module.exports = SingleLineTextLineHeightMethod;
