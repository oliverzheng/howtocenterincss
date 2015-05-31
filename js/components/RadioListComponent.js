/** @flow */

var React = require('react');
var RadioComponent = require('./RadioComponent');
var classnames = require('classnames');

class RadioListComponent<T> extends React.Component {
  state: {
    selectedOption: ?RadioComponent;
  };

  constructor(props: mixed) {
    super(props);

    this.state = {
      selectedOption: null,
    };
  }

  getValue(): ?T {
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
    this.setState((prevState, currentProps) => {
      if (prevState.selectedOption) {
        prevState.selectedOption.setIsSelected(false);
      }
      if (option) {
        option.setIsSelected(true);
      }
      return {
        selectedOption: option,
      };
    });
    if (this.props.onChange) {
      this.props.onChange(option ? option.props.value : null);
    }
  }

  clearSelection() {
    this._selectOption(null);
  }

  select(value: T) {
    var childrenRefKeys = Object.keys(this.refs);
    for (var i = 0; i < childrenRefKeys.length; i++) {
      var child = this.refs[childrenRefKeys[i]];
      if (child instanceof RadioComponent) {
        if (this._compareValues(child.props.value, value)) {
          this._selectOption(child);
          return;
        }
      }
    }
    throw new Error('No value found for ' + value);
  }

  _compareValues(value1: T, value2: T): bool {
    if (this.props.compareValues) {
      return this.props.compareValues(value1, value2);
    }
    return value1 === value2;
  }

  render(): ?ReactElement {
    var classes = classnames({
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
  compareValues: React.PropTypes.func,
  onChange: React.PropTypes.func,
  direction: React.PropTypes.oneOf(['vertical', 'horizontal']),
};
RadioListComponent.defaultProps = {
  direction: 'vertical',
};

module.exports = RadioListComponent;
