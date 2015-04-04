/** @flow */

var React = require('react');
var Method = require('../how/methods/Method');

class CodeComponent extends React.Component {
  state: {
    method: ?Method;
    code: ?string;
    noMethod: bool;
  };

  constructor(props) {
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
      <div>
        <h2>Code</h2>
        <p>Method: {method.getName()}</p>
        <pre>
          {code}
        </pre>
      </div>
    );
  }
}

CodeComponent.propTypes = {
  method: React.PropTypes.instanceOf(Method),
};

module.exports = CodeComponent;
