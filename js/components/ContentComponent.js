/** @flow */

var invariant = require('invariant');

var React = require('react');
var LengthComponent = require('./LengthComponent');
var DivSizeComponent = require('./DivSizeComponent');
var TextFontSizeComponent = require('./TextFontSizeComponent');
var TextLinesComponent = require('./TextLinesComponent');
var TextLineHeightComponent = require('./TextLineHeightComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

var Options = require('../how/Options');

class ContentType {
  static TEXT: ContentType;
  static IMAGE: ContentType;
  static DIV: ContentType;
}
ContentType.TEXT = new ContentType();
ContentType.IMAGE = new ContentType();
ContentType.DIV = new ContentType();

class ContentComponent extends React.Component {
  state: {
    contentType: ?ContentType;
    textLines: ?number;
  };
  _typeRadioList: ?RadioListComponent<ContentType>;
  _divSize: ?DivSizeComponent;
  _textLines: ?TextLinesComponent;
  _textFontSize: ?TextFontSizeComponent;
  _textLineHeight: ?TextLineHeightComponent;

  constructor(props: mixed) {
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

  setContent(content: Options.Content) {
    var contentText = content.text;

    var contentType = contentText ? ContentType.TEXT : ContentType.DIV;
    var typeRadioList = this._typeRadioList;
    invariant(typeRadioList, 'should have this');
    typeRadioList.select(contentType);

    if (contentText) {
      this.setState({
        contentType: contentType,
        textLines: contentText.lines,
      }, () => {
        invariant(contentText, 'flow');

        var textLinesComponent = this._textLines;
        invariant(textLinesComponent, 'should have text lines component');
        textLinesComponent.setLines(contentText.lines);

        var fontSizeComponent = this._textFontSize;
        if (fontSizeComponent) {
          fontSizeComponent.setFontSize(contentText.fontSize);
        }

        var lineHeightComponent = this._textLineHeight;
        if (lineHeightComponent) {
          lineHeightComponent.setLineHeight(contentText.lineHeight);
        }
      });
    } else {
      this.setState({
        contentType: contentType,
      }, () => {
        var divSizeComponent = this._divSize;
        invariant(divSizeComponent, 'should have div size component');

        divSizeComponent.setWidth(content.width);
        divSizeComponent.setHeight(content.height);
      });
    }
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
      } else if (this.state.textLines != null && this.state.textLines > 1) {
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
        <RadioListComponent
          ref={(c) => this._typeRadioList = c}
          onChange={this._handleTypeChange.bind(this)}>
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
