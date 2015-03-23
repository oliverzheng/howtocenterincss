/** @flow */

var React = require('react');
var ReactAddons = require('react/addons');
var RadioComponent = require('./RadioComponent');

class RadioListComponent extends React.Component {
  state: {
    selectedOption: ?RadioComponent;
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
    };
  }

  getValue(): ?mixed {
    if (this.state.selectedOption) {
      return this.state.selectedOption.props.value;
    }
    return null;
  }

  _handleClick(e: any) {
    var childrenRefKeys = Object.keys(this.refs);
    for (var i = 0; i < childrenRefKeys.length; i++) {
      var child = this.refs[childrenRefKeys[i]];
      if (child instanceof RadioComponent &&
          React.findDOMNode(child).contains(e.target) &&
          child !== this.state.selectedOption) {
        this._selectOption(child);
        break;
      }
    }
  }

  _selectOption(option: ?RadioComponent) {
    if (this.state.selectedOption) {
      this.state.selectedOption.setIsSelected(false);
    }
    if (option) {
      option.setIsSelected(true);
    }
    this.setState({
      selectedOption: option,
    });
    if (this.props.onChange) {
      this.props.onChange(option ? option.props.value : null);
    }
  }

  clearSelection() {
    this._selectOption(null);
  }

  render(): ?ReactElement {
    var classes = ReactAddons.classSet({
      'radioList': true,
      'horizontal': this.props.direction === 'horizontal',
    });
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    var children = React.Children.map(this.props.children, (child, i) => {
      if (child.type === RadioComponent) {
        return <RadioComponent {...child.props} ref={'child' + i} />;
      } else {
        return child;
      }
    });
    return (
      <div onClick={this._handleClick.bind(this)} className={classes}>
        {children}
      </div>
    );
  }
}
RadioListComponent.propTypes = {
  onChange: React.PropTypes.func,
  direction: React.PropTypes.oneOf(['vertical', 'horizontal']),
};
RadioListComponent.defaultProps = {
  direction: 'vertical',
};

module.exports = RadioListComponent;
