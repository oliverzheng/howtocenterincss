/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class DoNothingMethod extends Method {

  getName(): string {
    return 'Do nothing';
  }

  getRequirement(): Requirement {
    return Requirement.all([
      new Requirement(
        'Horizontally left aligned',
        c.checkHorizontalAlignment(Options.HorizontalAlignment.LEFT)
      ),
      new Requirement(
        'Vertically top aligned',
        c.checkVerticalAlignment(Options.VerticalAlignment.TOP)
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
    var parentStyles = {};
    parentStyles.position = 'relative';
    var childStyles = {};
    childStyles.position = 'absolute';

    var child;
    if (content.text) {
      child = this.getTextContent();
    } else {
      child = <div />;
    }
    return (
      <div>
        {child}
      </div>
    );
  }
}

module.exports = DoNothingMethod;
