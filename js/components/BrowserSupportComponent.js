/** @flow */

var React = require('react');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

var Options = require('../how/Options');

class BrowserSupportComponent extends React.Component {
	render(): ?ReactElement {
		return (
      <div>
        <h2>IE Support</h2>
        <p>Which versions of IE care about?</p>
        <RadioListComponent>
          <RadioComponent labelText="None" value={-1} />
          <RadioComponent labelText="6+" value={6} />
          <RadioComponent labelText="7+" value={7} />
          <RadioComponent labelText="8+" value={8} />
          <RadioComponent labelText="9+" value={9} />
          <RadioComponent labelText="10+" value={10} />
        </RadioListComponent>
      </div>
    );
	}
}

module.exports = BrowserSupportComponent;
