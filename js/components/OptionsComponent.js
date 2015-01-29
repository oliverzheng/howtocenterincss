/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');
var AlignmentComponent = require('./AlignmentComponent');
var BrowserSupportComponent = require('./BrowserSupportComponent');
var ContentComponent = require('./ContentComponent');

var Options = require('../how/Options');

var OptionsComponent = React.createClass({
  getOptions(): Object {
    return {
      content: Options.content(null, null, null),
      container: Options.container(null, null),
      horizontalAlignment: Options.HorizontalAlignments.LEFT,
      verticalAlignment: Options.VerticalAlignments.MIDDLE,
    };
  },

	render(): ?ReactElement {
		return (
      <div>
        <ContentComponent />
        <AlignmentComponent />
        <BrowserSupportComponent />
      </div>
    );
	},
});

module.exports = OptionsComponent;
