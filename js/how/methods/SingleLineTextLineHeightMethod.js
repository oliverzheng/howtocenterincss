/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var c = require('../checks');

class SingleLineTextLineHeightMethod extends Method {

  getName(): string {
    return 'Single line text using line height';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'Container height is set',
        c.checkContainer(c.requireHeightExists)
      ),
      new Requirement(
        'Content has single line of text',
        c.checkContent((content) => content.text && content.text.lines === 1)
      ),
      Requirement.any([
        new Requirement(
          'Content is aligned at the top or middle',
          c.checkAnyVerticalAlignment([
            Options.VerticalAlignment.TOP,
            Options.VerticalAlignment.MIDDLE,
          ])
        ),
        Requirement.all([
          new Requirement(
            'Content is aligned at the bottom',
            c.checkVerticalAlignment(Options.VerticalAlignment.BOTTOM)
          ),
          new Requirement(
            'Content has font-size',
            c.checkContentText(c.requireFontSizeExists)
          ),
        ]),
      ]),
    ]);
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
      if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
        styles.lineHeight = container.height.toString();
      } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
        styles.lineHeight =
          container.height.multiply(2).
          subtract(content.text.fontSize);
        styles.height = container.height.toString();
      }
    }
    return (
      <div style={styles}>
        {this.getTextContent()}
      </div>
    );
  }
}

module.exports = SingleLineTextLineHeightMethod;
