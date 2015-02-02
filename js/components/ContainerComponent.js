/** @flow */

var React = require('react');
var DivSizeComponent = require('./DivSizeComponent');

var Options = require('../how/Options');

var ContainerComponent = React.createClass({
  getInitialState() {
    return {
      width: null,
      height: null,
    };
  },

  getContainerOptions() {
    return null;
  },

	render(): ?ReactElement {
		return (
      <div>
        <h2>Container</h2>
        <p>How big is your container <code>&lt;div&gt;</code>?</p>
        <DivSizeComponent
          onWidthChange={(width) => this.setState({width})}
          onHeightChange={(height) => this.setState({height})}
        />
      </div>
    );
	},
});

module.exports = ContainerComponent;
