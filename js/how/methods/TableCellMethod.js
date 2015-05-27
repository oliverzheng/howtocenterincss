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
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ): { parent: ReactElement; middle: ?ReactElement; child: mixed; } {
    var child = this.getContentWithDOM(content, true /*requireBlock*/);
    var childStyles = child.props.style;

    var tableCellStyles = {};
    tableCellStyles.display = 'table-cell';

    if (content.text) {
      if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
        childStyles.textAlign = 'center';
      } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
        childStyles.textAlign = 'right';
      }
    } else {
      if (horizontalAlignment === Options.HorizontalAlignment.CENTER) {
        childStyles.marginLeft = 'auto';
        childStyles.marginRight = 'auto';
      } else if (horizontalAlignment === Options.HorizontalAlignment.RIGHT) {
        childStyles.marginLeft = 'auto';
      }
    }

    if (verticalAlignment === Options.VerticalAlignment.MIDDLE) {
      tableCellStyles.verticalAlign = 'middle';
    } else if (verticalAlignment === Options.VerticalAlignment.BOTTOM) {
      tableCellStyles.verticalAlign = 'bottom';
    }

    var tableCell =
      <div style={tableCellStyles}>
        {child}
      </div>;

    // A DOM element with display:table-cell must live inside a DOM element with
    // display:table-row, and that element must live inside a DOM element with
    // display:table. If the immediate parent of either element does not have
    // the required display value, the browser will implicitly create a hidden
    // element with that display value. This means by default,
    // a display:table-cell element will create a parent and a grand-parent.
    // This is all fine and dandy, unless we want to use a percentage for the
    // width or height. Setting height:100% on the table-cell doesn't do squat
    // because its parent (table-row) and grandparent (table) are already as
    // tall as the table-cell. What actually needs the height:100% is the table
    // element. The table-row element implicitly has as much height as the
    // table, and the table-cell as well, because a table can't be taller than
    // the sum of its table rows/cells.
    var needTableWrapper =
      !container.width ||
      container.width.lengthType === Options.LengthType.PERCENTAGE ||
      !container.height ||
      container.height.lengthType === Options.LengthType.PERCENTAGE;

    var parent;
    var middle = null;
    if (needTableWrapper) {
      var parentStyles = {
        display: 'table',
      };
      parent = <div style={parentStyles}>{tableCell}</div>;
      middle = tableCell;
    } else {
      parent = tableCell;
    }
    return { parent: parent, middle: middle, child: child };
  }
}

module.exports = TableCellMethod;
