/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');
var LengthComponent = require('./LengthComponent');
var DivSizeComponent = require('./DivSizeComponent');

var Options = require('../how/Options');

var ContentComponent = React.createClass({
  getInitialState(): {
    contentIsText: bool;
    contentIsImage: bool;
    contentIsDiv: bool;
    contentTextLines: ?number;
  } {
    return {
      contentIsText: false,
      contentIsImage: false,
      contentIsDiv: false,
      contentTextLines: null,
      contentTextLineHeight: null,
      contentDivWidth: null,
      contentDivHeight: null,
    };
  },

  getContentOptions() {
    if (this.state.contentIsText) {
      return Options.text(
        this.state.contentTextLines,
        this.state.contentTextLineHeight
      );
    }
      
    if (this.state.contentIsImage) {
    }

    if (this.state.contentIsDiv) {
      return null;
    }

    return null;
  },

  handleTypeChange(type: string) {
    this.setState({
      contentIsText: type === 'text',
      contentIsImage: type === 'image',
      contentIsDiv: type === 'div',
    });
  },

  handleTextLinesKnownChange(isText: bool) {
    if (!isText) {
      this.setState({
        contentTextLines: null,
      });
    } else if (this.state.contentTextLines == null) {
      this.setState({
        contentTextLines: 1,
      });
    }
  },

  handleTextLinesChange() {
    var string = this.refs.textLines.getDOMNode().value;
    this.setState({
      contentTextLines: string ? parseInt(string, 10) : null,
    });
  },

  handleLineHeightKnownChange(known) {
    if (!known) {
      this.setState({
        contentTextLineHeight: null,
      });
    }
  },

  handleLineHeightChange(lineHeight) {
    this.setState({
      contentTextLineHeight: lineHeight,
    });
  },

  renderContentText(): ?ReactElement {
    if (this.state.contentIsText) {
      return (
        <div>
          <p>Do you know how many lines of text it'll be?</p>
          <RadioListComponent onChange={this.handleTextLinesKnownChange}>
            <RadioComponent label="Yes" value={true}>
              <input
                type="text"
                className="numeric"
                ref="textLines"
                onChange={this.handleTextLinesChange}
                value={this.state.contentTextLines}
              /> lines
            </RadioComponent>
            <RadioComponent label="No" value={false}/>
          </RadioListComponent>
        </div>
      );
    }
  },

  renderContentTextLineHeight(): ?ReactElement {
    if (this.state.contentIsText && this.state.contentTextLines) {
      return (
        <div>
          <p>Do you know the <code>line-height</code> of each line?</p>
          <RadioListComponent onChange={this.handleLineHeightKnownChange}>
            <RadioComponent label="Yes" value={true}>
              <LengthComponent onChange={this.handleLineHeightChange} />
            </RadioComponent>
            <RadioComponent label="No" value={false}/>
          </RadioListComponent>
        </div>
      );
    }
  },

  renderContentDivSize(): ?ReactElement {
    if (this.state.contentIsDiv) {
      return (
        <DivSizeComponent
          onWidthChange={(width) => this.setState({contentDivWidth: width})}
          onHeightChange={(height) => this.setState({contentDivHeight: height})}
        />
      );
    }
  },

	render(): ?ReactElement {
		return (
      <div>
        <h2>Content</h2>
        <p>What do you want to center?</p>
        <RadioListComponent onChange={this.handleTypeChange}>
          <RadioComponent label="Text" value="text">
            Just text, or an inline-level block of text and images.
          </RadioComponent>
          <RadioComponent label="Image" value="image">
            A single image.
          </RadioComponent>
          <RadioComponent label="Div" value="div">
            Any block-level element.
          </RadioComponent>
        </RadioListComponent>
        {this.renderContentText()}
        {this.renderContentTextLineHeight()}
        {this.renderContentDivSize()}
      </div>
    );
	},
});

module.exports = ContentComponent;
