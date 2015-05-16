/** @flow */

var React = require('react');
var OptionsComponent = require('./OptionsComponent');
var CodeComponent = require('./CodeComponent');

var findMethod = require('../how/findMethod');

class MainComponent extends React.Component {
  _options: OptionsComponent;
  _code: CodeComponent;

  _handleGenerateClick() {
    var content = this._options.getContent();
    var container = this._options.getContainer();
    var horizontalAlignment = this._options.getHorizontalAlignment();
    var verticalAlignment = this._options.getVerticalAlignment();
    var browserSupport = this._options.getBrowserSupport();
    var method = findMethod(
      content,
      container,
      horizontalAlignment,
      verticalAlignment,
      browserSupport
    );
    if (method) {
      var code = method.getCode(
        content,
        container,
        horizontalAlignment,
        verticalAlignment,
        browserSupport
      );
      this._code.setMethod(method, code);
    } else {
      this._code.setNoMethod();
    }
  }

  render(): ?ReactElement {
    return (
      <div className="col-group">
        <div className="header col-2">
          <h1 className="logo">
            How to <span className="logo-center">Center</span> in CSS
          </h1>
          <p className="socialLogos">
            <a href="http://twitter.com/oliverzheng">
              <img src="./twitter.svg" className="socialLogo" />
            </a>
            <a href="http://facebook.com/oliverzheng">
              <img src="./facebook.svg" className="socialLogo" />
            </a>
            <a href="http://github.com/oliverzheng/howtocenterincss">
              <img src="./github.svg" className="socialLogo" />
            </a>
          </p>
        </div>
        <div className="options col-6 col-offset-1">
          <h2>Wat</h2>
          <p>
            Centering in CSS is a pain in the ass. There seems to be a gazillion
            ways to do it, depending on a variety of factors. This consolidates
            them and gives you the code you need for each situation.
          </p>
          <p>
            Select the type of content you want to center in a
            parent <code>&lt;div&gt;</code> and the size of the parent.
          </p>
          <OptionsComponent ref={(c) => this._options = c} />
          <p>
            <button className="generate" onClick={this._handleGenerateClick.bind(this)}>
              Generate Code
            </button>
          </p>
          <CodeComponent ref={(c) => this._code = c} />
        </div>
      </div>
    );
  }
}

module.exports = MainComponent;
