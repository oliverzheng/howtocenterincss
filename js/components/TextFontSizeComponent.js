/** @flow */

var React = require('react');
var Options = require('../how/Options');
var LengthComponent = require('./LengthComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class TextFontSizeComponent extends React.Component {
  _radioList: RadioListComponent<bool>;
  _fontSize: LengthComponent;

  getFontSize(): ?Options.Length {
    return this._fontSize.getLength();
  }

  setFontSize(fontSize: ?Options.Length) {
    if (fontSize) {
      this._radioList.select(true);
      this._fontSize.setLength(fontSize);
    } else {
      this._radioList.select(false);
    }
  }

  _handleFontSizeKnownChange(known: bool) {
    if (!known) {
      if (this.props.onChange) {
        this.props.onChange(null);
      }
      this._fontSize.clear();
    } else {
      this._fontSize.selectDefaultType();
    }
  }

  render(): ?ReactElement {
    return (
      <div>
        <p>Do you know the <code>font-size</code>?</p>
        <RadioListComponent
          ref={(c) => this._radioList = c}
          onChange={this._handleFontSizeKnownChange.bind(this)}>
          <RadioComponent labelText="Yes" value={true}>
            <LengthComponent
              onChange={this.props.onChange}
              ref={(c) => this._fontSize = c}
            />
          </RadioComponent>
          <RadioComponent labelText="No" value={false}/>
        </RadioListComponent>
      </div>
    );
  }
}
TextFontSizeComponent.propTypes = {
  onChange: React.PropTypes.func,
};

module.exports = TextFontSizeComponent;
