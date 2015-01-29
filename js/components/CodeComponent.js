/** @flow */

var React = require('react');

var CodeComponent = React.createClass({

  setOptions(options: Object) {
  },

	render(): ?ReactElement {
		return (
      <div>
        <h2>Code</h2>
        <p>Method #3: text align</p>
        <pre>
          &lt;div style="text-align: center"&gt;
        </pre>
      </div>
    );
	},
});

module.exports = CodeComponent;
