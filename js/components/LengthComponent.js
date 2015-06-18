/** @flow */

var React = require('react');
var Options = require('../how/Options');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class LengthComponent extends React.Component {
  state: {
    value: ?number;
    type: ?Options.LengthType;
  };
  _valueInput: React.Component;
  _radioList: RadioListComponent;

  constructor(props: mixed) {
    super(props);
    this.state = { value: null, type: null };
  }

  getLength(): ?Options.Length {
    if (!this.state.value || !this.state.type) {
      return null;
    }
    return new Options.Length(this.state.value, this.state.type);
  }

  setLength(length: Options.Length) {
    this.setState({
      value: length.value,
      type: length.lengthType,
    });
    this._radioList.select(length.lengthType);
  }

  selectDefaultType() {
    this._radioList.select(Options.LengthType.PIXEL);
  }

  _handleValueChange() {
    var string = this._valueInput.getDOMNode().value;
    this.setState({
      value: string ? parseInt(string, 10) : null,
    }, this._callback);
  }

  _handleTypeChange(type: Options.LengthType) {
    this.setState({type}, this._callback);
  }

  _callback() {
    var length;
    if (this.state.value != null && this.state.type != null) {
      length = new Options.Length(this.state.value, this.state.type);
    }
    if (this.props.onLengthChange) {
      this.props.onLengthChange(length);
    }
  }

  clear() {
    this.setState({
      value: null,
    });
    this._radioList.clearSelection();
  }

  render(): ?ReactElement {
    return (
      <div>
        <input
          className="numeric text"
          type="number"
          pattern="[0-9]*"
          ref={(c) => this._valueInput = c}
          onChange={this._handleValueChange.bind(this)}
          value={this.state.value}
        />
        <RadioListComponent
          className="lengthUnit"
          direction="horizontal"
          onChange={this._handleTypeChange.bind(this)}
          ref={(c) => this._radioList = c}>
          <RadioComponent value={Options.LengthType.PIXEL} labelText="px" />
          <RadioComponent value={Options.LengthType.EM} labelText="em" />
          <RadioComponent value={Options.LengthType.PERCENTAGE} labelText="%" />
        </RadioListComponent>
      </div>
    );
  }
}
LengthComponent.propTypes = {
  onLengthChange: React.PropTypes.func,
  onLengthEdit: React.PropTypes.func,
};

module.exports = LengthComponent;
