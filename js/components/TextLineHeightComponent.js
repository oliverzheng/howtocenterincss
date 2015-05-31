/** @flow */

var React = require('react');
var Options = require('../how/Options');
var LengthComponent = require('./LengthComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class TextLineHeightComponent extends React.Component {
  _radioList: RadioListComponent<bool>;
  _lineHeight: LengthComponent;

  getLineHeight(): ?Options.Length {
    return this._lineHeight.getLength();
  }

  setLineHeight(lineHeight: ?Options.Length) {
    if (lineHeight) {
      this._radioList.select(true);
      this._lineHeight.setLength(lineHeight);
    } else {
      this._radioList.select(false);
    }
  }

  _handleLineHeightKnownChange(known: bool) {
    if (!known) {
      if (this.props.onChange) {
        this.props.onChange(null);
      }
      this._lineHeight.clear();
    } else {
      this._lineHeight.selectDefaultType();
    }
  }

  render(): ?ReactElement {
    return (
      <div>
        <p>Do you know the <code>line-height</code> of each line?</p>
        <RadioListComponent
          ref={(c) => this._radioList = c}
          onChange={this._handleLineHeightKnownChange.bind(this)}>
          <RadioComponent labelText="Yes" value={true}>
            <LengthComponent
              onChange={this.props.onChange}
              ref={(c) => this._lineHeight = c}
            />
          </RadioComponent>
          <RadioComponent labelText="No" value={false}/>
        </RadioListComponent>
      </div>
    );
  }
}
TextLineHeightComponent.propTypes = {
  onChange: React.PropTypes.func,
};

module.exports = TextLineHeightComponent;
