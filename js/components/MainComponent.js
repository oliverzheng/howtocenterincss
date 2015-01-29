/** @flow */

var React = require('react');
var OptionsComponent = require('./OptionsComponent');
var CodeComponent = require('./CodeComponent');

var MainComponent = React.createClass({
  handleGenerate() {
    var options = this.refs.options.getOptions();
    this.refs.code.setOptions(options);
  },

	render(): ?ReactElement {
		return (
      <div className="col-group">
        <div className="header col-2">
          <h1 className="logo">
            How to <span className="logo-center">Center</span> in CSS
          </h1>
        </div>
        <div className="options col-6 col-offset-1">
          <h2>Wat</h2>
          <p>
            Centering in CSS is a pain in the ass. There seems to be a gazillion
            ways to do it, depending on a variety of factors. This consolidates
            them and gives you the code you need for each situation.
          </p>
          <p>
            Select the type of content you want to center in a
            parent <code>&lt;div&gt;</code> and the size of the parent.
          </p>
          <OptionsComponent ref="options" />
          <p>
            <button className="generate" onClick={this.handleGenerate}>
              Generate Code
            </button>
          </p>
          <CodeComponent ref="code" />
        </div>
      </div>
    );
	},
});

module.exports = MainComponent;
