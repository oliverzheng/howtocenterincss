/** @flow */

var React = require('react');
var classnames = require('classnames');

class RadioComponent extends React.Component {
  isSelected: bool;

  constructor(props: mixed) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  setIsSelected(isSelected: bool) {
    this.setState({isSelected});
  }

  render(): ?ReactElement {
    var children;
    if (React.Children.count(this.props.children)) {
      children =
        <div className="labelDescription">
          {this.props.children}
        </div>;
    }
    var classes = classnames({
      'radioOption': true,
      'radioOptionSelected': this.state.isSelected,
    });
    return (
      <div className={classes}>
        <div className="label">{this.props.labelText}</div>
        {children}
      </div>
    );
  }
}
RadioComponent.propTypes = {
  labelText: React.PropTypes.string.isRequired,
  value: React.PropTypes.any.isRequired,
};

module.exports =  RadioComponent;
