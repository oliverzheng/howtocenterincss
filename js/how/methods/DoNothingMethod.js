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
  ): { parent: ReactElement; middle: ?ReactElement; child: mixed; } {
    var parentStyles = {};
    parentStyles.position = 'relative';
    var childStyles = {};
    childStyles.position = 'absolute';

    var child = this.getContent(content);

    var parent =
      <div>
        {child}
      </div>;

    return { parent: parent, middle: null, child: child };
  }
}

module.exports = DoNothingMethod;
