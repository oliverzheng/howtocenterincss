/* @flow */

var invariant = require('invariant');

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var c = require('../checks');

var browserSupport = new Options.BrowserSupport([
  new Options.BrowserVersionRequired(Options.Browser.IE, '11'),
]);

class FlexMethod extends Method {

  getName(): string {
    return 'Flexbox';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'IE11 and above',
        c.checkBrowserSupport(browserSupport)
      ),
    ]);
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): ReactElement {
    var styles = {};

    styles.display = 'flex';
    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      styles.justifyContent = 'center';
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      styles.justifyContent = 'flex-end';
    }

    if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
      styles.alignItems = 'center';
    } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
      styles.alignItems = 'flex-end';
    }

    return (
      <div style={styles}>
        {content.text ? this.getTextContent() : this.getContent()}
      </div>
    );
  }
}

module.exports = FlexMethod;
