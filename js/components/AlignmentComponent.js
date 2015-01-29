/** @flow */

var React = require('react');
var {
  RadioComponent,
  RadioListComponent,
} = require('./form');

var Options = require('../how/Options');

var AlignmentComponent = React.createClass({
  getInitialState(): {
    horizontalAlignment: ?string;
    verticalAlignment: ?string;
  } {
    return {
      horizontalAlignment: null,
      verticalAlignment: null,
    };
  },

  getOptions(): Object {
    if (!this.state.horizontalAlignment && !this.state.verticalAlignment) {
      return null;
    }
    return {
      horizontalAlignment: Options.HorizontalAlignments.LEFT,
      verticalAlignment: Options.VerticalAlignments.MIDDLE,
    };
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

	render(): ?ReactElement {
		return (
      <div>
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
      </div>
    );
	},
});

module.exports = AlignmentComponent;
