/** @flow */

var React = require('react');
var Options = require('../how/Options');
var LengthComponent = require('./LengthComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class TextFontSizeComponent extends React.Component {
  _fontSize: LengthComponent;

  getFontSize(): ?Options.Length {
    return this._fontSize.getLength();
  }

  _handleFontSizeKnownChange(known: bool) {
    if (!known) {
      if (this.props.onChange) {
        this.props.onChange(null);
      }
      this._fontSize.clear();
    }
  }

  render(): ?ReactElement {
    return (
      <div>
        <p>Do you know the <code>font-size</code>?</p>
        <RadioListComponent onChange={this._handleFontSizeKnownChange.bind(this)}>
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
