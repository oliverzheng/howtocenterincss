/** @flow */

var React = require('react');
var Options = require('../how/Options');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');

var LengthComponent = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
  },

  getInitialState() {
    return {
      value: null,
      type: null,
    };
  },

  handleValueChange() {
    var string = this.refs.valueInput.getDOMNode().value;
    this.setState({
      value: string ? parseInt(string, 10) : null,
    }, this.callback);
  },

  handleUnitChange(type: string) {
    this.setState({type}, this.callback);
  },

  callback() {
    if (this.state.value != null && this.state.type) {
      var length: Options.Length = {
        lengthType: this.state.type,
        value: this.state.value,
      };
      this.props.onChange(length);
    }
  },

	render(): ?ReactElement {
    return (
      <div>
        <input
          type="text"
          className="numeric"
          ref="valueInput"
          onChange={this.handleValueChange}
          value={this.state.value}
        />
        <RadioListComponent
          className="lengthUnit"
          direction="horizontal"
          onChange={this.handleUnitChange}>
          <RadioComponent value={Options.LengthTypes.PIXEL} label="px" />
          <RadioComponent value={Options.LengthTypes.EM} label="em" />
          <RadioComponent value={Options.LengthTypes.PERCENTAGE} label="%" />
        </RadioListComponent>
      </div>
    );
	},
});

module.exports = LengthComponent;
