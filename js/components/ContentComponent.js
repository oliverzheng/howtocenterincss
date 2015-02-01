/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');

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
    };
  },

  getContentOptions() {
    if (this.state.contentIsText) {
      return Options.text(this.state.contentTextLines, null);
    }
      
    if (this.state.contentIsImage) {
    }

    if (this.state.contentIsDiv) {
      return null;
    }

    return null;
  },

  handleContentTypeChange(type: string) {
    this.setState({
      contentIsText: type === 'text',
      contentIsImage: type === 'image',
      contentIsDiv: type === 'div',
    });
  },

  handleContentTextChange(isText: bool) {
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

  handleContentTextLinesChange() {
    var string = this.refs.textLines.getDOMNode().value;
    this.setState({
      contentTextLines: string ? parseInt(string, 10) : null,
    });
  },

  handleContentTextLineHeightChange() {
    var string = this.refs.textLineHeight.getDOMNode().value;
    this.setState({
      contentTextLineHeight: string ? parseInt(string, 10) : null,
    });
  },

  renderContentText(): ?ReactElement {
    if (this.state.contentIsText) {
      return (
        <div>
          <p>Do you know how many lines of text it'll be?</p>
          <RadioListComponent onChange={this.handleContentTextChange}>
            <RadioComponent label="Yes" value={true}>
              <input
                type="text"
                className="numeric"
                ref="textLines"
                onChange={this.handleContentTextLinesChange}
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
          <RadioListComponent onChange={this.handleContentTextLineHeightChange}>
            <RadioComponent label="Yes" value={true}>
              <input
                type="text"
                className="numeric"
                ref="textLineHeight"
                onChange={this.handleContentTextLineHeightChange}
                value={this.state.contentTextLineHeight}
              />
              <select>
                <option value="px">px</option>
                <option value="em">em</option>
              </select>
            </RadioComponent>
            <RadioComponent label="No" value={false}/>
          </RadioListComponent>
        </div>
      );
    }
  },

	render(): ?ReactElement {
		return (
      <div>
        <h2>Content</h2>
        <p>What do you want to center?</p>
        <RadioListComponent onChange={this.handleContentTypeChange}>
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
      </div>
    );
	},
});

module.exports = ContentComponent;
