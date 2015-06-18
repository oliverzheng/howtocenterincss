/** @flow */

var React = require('react');
var Options = require('../how/Options');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class TextLinesComponent extends React.Component {
  state: {
    lines: ?number;
  };
  _radioList: RadioListComponent<bool>;
  _linesInput: React.Component;

  constructor(props: mixed) {
    super(props);
    this.state = {
      lines: null,
    };
  }

  getLines(): ?number {
    return this.state.lines;
  }

  setLines(lines: ?number) {
    if (lines != null) {
      this._radioList.select(true);
      this._setLines(lines);
    } else {
      this._radioList.select(false);
    }
  }

  _handleTextLinesKnownChange(known: bool) {
    if (!known) {
      this._setLines(null);
    }
  }

  _handleTextLinesChange() {
    var string = this._linesInput.getDOMNode().value;
    this._setLines(string ? parseInt(string, 10) : null);
  }

  _setLines(lines: ?number) {
    this.setState({lines});
    if (this.props.onChange) {
      this.props.onChange(lines);
    }
  }

  render(): ?ReactElement {
    return (
      <div>
        <p>Do you know how many lines of text it'll be?</p>
        <RadioListComponent
          ref={(c) => this._radioList = c}
          onChange={this._handleTextLinesKnownChange.bind(this)}>
          <RadioComponent labelText="Yes" value={true}>
            <input
              className="numeric text"
              type="number"
              pattern="[0-9]*"
              ref={(c) => this._linesInput = c}
              onChange={this._handleTextLinesChange.bind(this)}
              value={this.state.lines}
            /> lines
          </RadioComponent>
          <RadioComponent labelText="No" value={false}/>
        </RadioListComponent>
      </div>
    );
  }
}
TextLinesComponent.propTypes = {
  onChange: React.PropTypes.func,
};

module.exports = TextLinesComponent;
