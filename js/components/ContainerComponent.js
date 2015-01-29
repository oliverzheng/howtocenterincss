/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');

var Options = require('../how/Options');

var OptionsComponent = React.createClass({
  getInitialState(): {
    contentIsText: bool;
    contentIsImage: bool;
    contentIsDiv: bool;
    contentTextLines: ?number;
    horizontalAlignment: ?string;
    verticalAlignment: ?string;
  } {
    return {
      contentIsText: false,
      contentIsImage: false,
      contentIsDiv: false,
      contentTextLines: null,
      horizontalAlignment: null,
      verticalAlignment: null,
    };
  },

  getOptions(): Object {
    return {
      content: Options.content(null, null, null),
      container: Options.container(null, null),
      horizontalAlignment: Options.HorizontalAlignments.LEFT,
      verticalAlignment: Options.VerticalAlignments.MIDDLE,
    };
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
    this.setState({
      contentTextLines: parseInt(this.refs.textLines.getDOMNode().value, 10),
    });
  },

  handleHorizontalAlignmentChange(alignment: string) {
    this.setState({
      horizontalAlignment: alignment,
    });
  },

  handleVerticalAlignmentChange(alignment: string) {
    this.setState({
      verticalAlignment: alignment,
    });
  },

  canGenerateCode(): bool {
    return (
      (this.state.contentIsText ||
       this.state.contentIsImage ||
       this.state.contentIsDiv
      ) &&
      (this.state.horizontalAlignment && this.state.verticalAlignment)
    );
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
        <h2>Alignment</h2>
        <p>How do you want to align the content?</p>
        <div className="col-group">
          <div className="col-5 col-mb-5">
            <h3>Horizontally</h3>
            <RadioListComponent onChange={this.handleHorizontalAlignmentChange}>
              <RadioComponent
                label="Left"
                value={Options.HorizontalAlignments.LEFT}
              />
              <RadioComponent
                label="Center"
                value={Options.HorizontalAlignments.CENTER}
              />
              <RadioComponent
                label="Right"
                value={Options.HorizontalAlignments.RIGHT}
              />
            </RadioListComponent>
          </div>
          <div className="col-5 col-mb-5">
            <h3>Vertically</h3>
            <RadioListComponent>
              <RadioComponent
                label="Top"
                value={Options.HorizontalAlignments.TOP}
              />
              <RadioComponent
                label="Middle"
                value={Options.HorizontalAlignments.MIDDLE}
              />
              <RadioComponent
                label="Bottom"
                value={Options.HorizontalAlignments.BOTTOM}
              />
            </RadioListComponent>
          </div>
        </div>
        <h2>IE Support</h2>
        <p>Which versions of IE care about?</p>
        <RadioListComponent>
          <RadioComponent label="None" value={-1} />
          <RadioComponent label="6+" value={6} />
          <RadioComponent label="7+" value={7} />
          <RadioComponent label="8+" value={8} />
          <RadioComponent label="9+" value={9} />
          <RadioComponent label="10+" value={10} />
        </RadioListComponent>
      </div>
    );
	},
});

module.exports = OptionsComponent;
