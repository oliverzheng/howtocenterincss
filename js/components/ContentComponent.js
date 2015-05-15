/** @flow */

var React = require('react');
var LengthComponent = require('./LengthComponent');
var DivSizeComponent = require('./DivSizeComponent');
var TextFontSizeComponent = require('./TextFontSizeComponent');
var TextLinesComponent = require('./TextLinesComponent');
var TextLineHeightComponent = require('./TextLineHeightComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

var Options = require('../how/Options');

class ContentType {}
ContentType.TEXT = new ContentType();
ContentType.IMAGE = new ContentType();
ContentType.DIV = new ContentType();

class ContentComponent extends React.Component {
  state: {
    contentType: ?ContentType;
    textLinesKnown: bool;
  };
  _divSize: ?DivSizeComponent;
  _textLines: ?TextLinesComponent;
  _textFontSize: ?TextFontSizeComponent;
  _textLineHeight: ?TextLineHeightComponent;

  constructor(props) {
    super(props);
    this.state = {
      contentType: null,
      textLines: null,
    };
  }

  getContent(): ?Options.Content {
    var textLines = this._textLines;
    var divSize = this._divSize;
    if (textLines) {
      var lines = textLines.getLines();
      if (lines === 1) {
        var fontSize =
          this._textFontSize ? this._textFontSize.getFontSize() : null;
        return Options.Content.text(fontSize, lines, null);
      } else {
        var lineHeight =
          this._textLineHeight ? this._textLineHeight.getLineHeight() : null;
        return Options.Content.text(null, lines, lineHeight);
      }
    } else if (divSize) {
      return new Options.Content(
        divSize.getWidth(),
        divSize.getHeight(),
        null
      );
    } else if (this.state.contentType === ContentType.IMAGE) {
      // TODO
      return null;
    }
    return null;
  }

  _handleTypeChange(contentType: ContentType) {
    this.setState({contentType});
  }

  _handleTextLinesChange(lines: ?number) {
    this.setState({
      textLines: lines,
    });
  }

  _renderContentText(): ?ReactElement {
    if (this.state.contentType === ContentType.TEXT) {
      var textLineHeight;
      var textFontSize;
      if (this.state.textLines === 1) {
        textFontSize =
          <TextFontSizeComponent ref={(c) => this._textFontSize = c} />;
      } else if (this.state.textLines > 1) {
        textLineHeight =
          <TextLineHeightComponent ref={(c) => this._textLineHeight = c} />;
      }
      return (
        <div>
          <TextLinesComponent
            onChange={this._handleTextLinesChange.bind(this)}
            ref={(c) => this._textLines = c}
          />
          {textFontSize}
          {textLineHeight}
        </div>
      );
    }
  }

  _renderContentDivSize(): ?ReactElement {
    if (this.state.contentType === ContentType.DIV) {
      return <DivSizeComponent ref={(c) => this._divSize = c} />;
    }
  }

  render(): ?ReactElement {
    // TODO add back in image if it matters.
    return (
      <div>
        <h2>Content</h2>
        <p>What do you want to center?</p>
        <RadioListComponent onChange={this._handleTypeChange.bind(this)}>
          <RadioComponent labelText="Text" value={ContentType.TEXT}>
            Just text, or an inline-level block of text and images.
          </RadioComponent>
          <RadioComponent labelText="Div" value={ContentType.DIV}>
            Any block-level element.
          </RadioComponent>
        </RadioListComponent>
        {this._renderContentText()}
        {this._renderContentDivSize()}
      </div>
    );
  }
}

module.exports = ContentComponent;
