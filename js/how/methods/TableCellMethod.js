/* @flow */

var Method = require('./Method');
var Requirement = require('./Requirement');
var Options = require('../Options');
var React = require('react');

var invariant = require('invariant');

var c = require('../checks');

class TableCellMethod extends Method {

  getName(): string {
    return 'Table cell';
  }

  getRequirement(): Requirement {
    return Requirement.all([
    ]);
  }

  getCodeElement(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment
  ): ReactElement {
    var tableCellStyles = {};
    tableCellStyles.display = 'table-cell';
    var childStyles = {};

    if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
      childStyles.marginLeft = 'auto';
      childStyles.marginRight = 'auto';
    } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
      childStyles.marginLeft = 'auto';
    }

    if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
      tableCellStyles.verticalAlign = 'middle';
    } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
      tableCellStyles.verticalAlign = 'bottom';
    }

    var child;
    if (content.text) {
      child = <div style={childStyles}>{this.getTextContent()}</div>;
    } else {
      child = <div style={childStyles}/>;
    }
    return (
      <div style={tableCellStyles}>
        {child}
      </div>
    );
  }
}

module.exports = TableCellMethod;
