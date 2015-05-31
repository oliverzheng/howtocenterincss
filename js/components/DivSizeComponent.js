/** @flow */

var React = require('react');
var Options = require('../how/Options');
var LengthComponent = require('./LengthComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

class DivSizeComponent extends React.Component {
  _widthRadioList: RadioListComponent<bool>;
  _heightRadioList: RadioListComponent<bool>;
  _width: LengthComponent;
  _height: LengthComponent;

  getWidth(): ?Options.Length {
    return this._width.getLength();
  }

  setWidth(length: ?Options.Length) {
    if (length) {
      this._widthRadioList.select(true);
      this._width.setLength(length);
    } else {
      this._widthRadioList.select(false);
    }
  }

  getHeight(): ?Options.Length {
    return this._height.getLength();
  }

  setHeight(length: ?Options.Length) {
    if (length) {
      this._heightRadioList.select(true);
      this._height.setLength(length);
    } else {
      this._heightRadioList.select(false);
    }
  }

  _handleWidthKnown(known: bool) {
    if (!known) {
      if (this.props.onWidthChange) {
        this.props.onWidthChange(null);
      }
      this._width.clear();
    } else {
      this._width.selectDefaultType();
    }
  }

  _handleHeightKnown(known: bool) {
    if (!known) {
      if (this.props.onHeightChange) {
        this.props.onHeightChange(null);
      }
      this._height.clear();
    } else {
      this._height.selectDefaultType();
    }
  }

  render(): ?ReactElement {
    return (
      <div>
        <h3>Width</h3>
        <RadioListComponent
          ref={(c) => this._widthRadioList = c}
          onChange={this._handleWidthKnown.bind(this)}>
          <RadioComponent labelText="Known" value={true}>
            <LengthComponent
              onChange={this.props.onWidthChange}
              ref={(c) => this._width = c}
            />
          </RadioComponent>
          <RadioComponent labelText="Unknown" value={false}>
            The width is not known until runtime, or needs to be set dynamically.
          </RadioComponent>
        </RadioListComponent>

        <h3>Height</h3>
        <RadioListComponent
          ref={(c) => this._heightRadioList = c}
          onChange={this._handleHeightKnown.bind(this)}>
          <RadioComponent labelText="Known" value={true}>
            <LengthComponent
              onChange={this.props.onHeightChange}
              ref={(c) => this._height = c}
            />
          </RadioComponent>
          <RadioComponent labelText="Unknown" value={false}>
            The height is not known until runtime, or needs to be set dynamically.
          </RadioComponent>
        </RadioListComponent>
      </div>
    );
  }
}
DivSizeComponent.propTypes = {
  onWidthChange: React.PropTypes.func,
  onHeightChange: React.PropTypes.func,
};

module.exports = DivSizeComponent;
