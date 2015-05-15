/* @flow */

var invariant = require('invariant');

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
        c.checkContentText((text) => text.lines === 1)
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
      var containerHeight = container.height;
      invariant(containerHeight, 'Must have container height');

      if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
        styles.lineHeight = containerHeight.toString();
      } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
        var text = content.text;
        invariant(text, 'Must have content text');
        var fontSize = text.fontSize;
        invariant(fontSize, 'Must have content text font size');

        styles.lineHeight =
          containerHeight.multiply(2).
          subtract(fontSize);
        styles.height = containerHeight.toString();
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
