/** @flow */

var React = require('react');
var ReactAddons = require('react-addons');

var shortId = require('shortid');

var RadioComponent = React.createClass({
  propTypes: {
    // all should be isRequired, but flow :(
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.any,
    id: React.PropTypes.string,
  },

	render(): ?ReactElement {
    var children = this.props.children;
    if (children) {
      children =
        <div className="labelDescription">
          {children}
        </div>;
    }
		return (
      <div className="radioOption">
        <input
          type="radio"
          name={this.props.name}
          id={this.props.id}
          value={this.props.label}
        />
        <label htmlFor={this.props.id}>
          {this.props.label}
          {children}
        </label>
      </div>
    );
	},
});

var RadioListComponent = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    direction: React.PropTypes.oneOf(['vertical', 'horizontal']),
  },

  getDefaultProps() {
    return {
      direction: 'vertical',
    };
  },

  getInitialState(): {name: string; selectedValue: ?string} {
    return {
      name: shortId.generate(),
      selectedValue: null,
      childrenRefs: [],
    };
  },

  onChange(e: Object) {
    var radio = this.refs[e.target.id]
    if (!radio) {
      // It wasn't a radio selection that changed this.
      return;
    }
    var selectedValue = radio.props.value;
    if (selectedValue !== this.state.selectedValue) {
      this.setState({ selectedValue });
      var onChange = this.props.onChange;
      if (onChange) {
        onChange(selectedValue);
      }
    }
  },

  componentWillMount() {
    this.setState({
      childrenRefs: this.props.children.map(() => shortId.generate()),
    });
  },

  render(): ?ReactElement {
    var children = React.Children.map(this.props.children, (child, i) => {
      if (child.type === RadioComponent.type) {
        return (
          <RadioComponent
            {...child.props}
            name={this.state.name}
            id={this.state.childrenRefs[i]}
            ref={this.state.childrenRefs[i]}
          />
        );
      } else {
        return child;
      }
    });
    var classes = ReactAddons.classSet({
      'radioList': true,
      'horizontal': this.props.direction === 'horizontal',
    });
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div onChange={this.onChange} className={classes}>
        {children}
      </div>
    );
  },
});

module.exports = {
  RadioComponent,
  RadioListComponent,
};
