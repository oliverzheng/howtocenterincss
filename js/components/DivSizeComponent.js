/** @flow */

var React = require('react');
var Options = require('../how/Options');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');
var LengthComponent = require('./LengthComponent');

var DivSizeComponent = React.createClass({
  propTypes: {
    onWidthChange: React.PropTypes.func,
    onHeightChange: React.PropTypes.func,
  },

  handleWidthKnown(known) {
    if (!known) {
      this.props.onWidthChange(null);
    }
  },

  handleHeightKnown(known) {
    if (!known) {
      this.props.onHeightChange(null);
    }
  },

	render(): ?ReactElement {
    return (
      <div>
        <h3>Width</h3>
        <RadioListComponent onChange={this.handleWidthKnown}>
          <RadioComponent label="Known" value={true}>
            <LengthComponent onChange={this.props.onWidthChange} />
          </RadioComponent>
          <RadioComponent label="Unknown" value={false}>
            The width is not known until runtime, or needs to be set dynamically.
          </RadioComponent>
        </RadioListComponent>

        <h3>Height</h3>
        <RadioListComponent onChange={this.handleHeightKnown}>
          <RadioComponent label="Known" value={true}>
            <LengthComponent onChange={this.props.onHeightChange} />
          </RadioComponent>
          <RadioComponent label="Unknown" value={false}>
            The height is not known until runtime, or needs to be set dynamically.
          </RadioComponent>
        </RadioListComponent>
      </div>
    );
	},
});

module.exports = DivSizeComponent;
