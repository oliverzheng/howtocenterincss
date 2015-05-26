/** @flow */

var invariant = require('invariant');
var React = require('react');
var Method = require('../how/methods/Method');

class CodeComponent extends React.Component {
  _div: ?ReactElement;

  state: {
    method: ?Method;
    code: ?string;
    noMethod: bool;
  };

  constructor(props: mixed) {
    super(props);
    this.state = {
      method: null,
      code: null,
      noMethod: false,
    };
  }

  setMethod(method: Method, code: string) {
    this.setState({
      method: method,
      code: code,
      noMethod: false,
    });
  }

  componentDidUpdate() {
    if (this.state.method && this.state.code) {
      var element = React.findDOMNode(this._div);
      invariant(element, 'Should have a wrapper div');
      element.scrollIntoView();
    }
  }

  setNoMethod() {
    this.setState({
      method: null,
      code: null,
      noMethod: true,
    });
  }

  render(): ?ReactElement {
    if (this.state.noMethod) {
      return <p>No method found. :(</p>;
    }
    var method = this.state.method;
    var code = this.state.code;
    if (!method || !code) {
      return null;
    }
    return (
      <div ref={(c) => this._div = c}>
        <h2>Code</h2>
        <p>Method: {method.getName()}</p>
        <pre>
          {code}
        </pre>
        <p>
          This assumes standards compliant rendering (i.e. not quirks mode rendering).
          Add <code>&lt;!DOCTYPE html&gt;</code> to the top of your page.
        </p>
      </div>
    );
  }
}

CodeComponent.propTypes = {
  method: React.PropTypes.instanceOf(Method),
};

module.exports = CodeComponent;
