/** @flow */

var React = require('react');
var DivSizeComponent = require('./DivSizeComponent');

var Options = require('../how/Options');

class ContainerComponent extends React.Component {
  _divSize: DivSizeComponent;

  getContainer(): Options.Container {
    return new Options.Container(
      this._divSize.getWidth(),
      this._divSize.getHeight()
    );
  }

  setContainer(container: Options.Container) {
    this._divSize.setWidth(container.width);
    this._divSize.setHeight(container.height);
  }

  render(): ?ReactElement {
    return (
      <div>
        <h2>Container</h2>
        <p>How big is your container <code>&lt;div&gt;</code>?</p>
        <DivSizeComponent ref={(c) => this._divSize = c} />
      </div>
    );
  }
}

module.exports = ContainerComponent;
