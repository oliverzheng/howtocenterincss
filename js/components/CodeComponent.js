/** @flow */

var React = require('react');

class CodeComponent extends React.Component {

  setOptions(options: Object) {
  }

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
	}
}

module.exports = CodeComponent;
