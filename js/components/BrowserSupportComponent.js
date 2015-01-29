/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');

var Options = require('../how/Options');

var BrowserSupportComponent = React.createClass({
  getOptions(): Object {
    return {
    };
  },

	render(): ?ReactElement {
		return (
      <div>
        <h2>IE Support</h2>
        <p>Which versions of IE care about?</p>
        <RadioListComponent>
          <RadioComponent label="None" value={-1} />
          <RadioComponent label="6+" value={6} />
          <RadioComponent label="7+" value={7} />
          <RadioComponent label="8+" value={8} />
          <RadioComponent label="9+" value={9} />
          <RadioComponent label="10+" value={10} />
        </RadioListComponent>
      </div>
    );
	},
});

module.exports = BrowserSupportComponent;
