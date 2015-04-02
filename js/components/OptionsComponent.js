/** @flow */

var React = require('react');
var AlignmentComponent = require('./AlignmentComponent');
var BrowserSupportComponent = require('./BrowserSupportComponent');
var ContentComponent = require('./ContentComponent');
var ContainerComponent = require('./ContainerComponent');
var RadioComponent = require('./RadioComponent');
var RadioListComponent = require('./RadioListComponent');

var Options = require('../how/Options');

class OptionsComponent extends React.Component {
  _content: ContentComponent;
  _container: ContainerComponent;
  _alignment: AlignmentComponent;
  _browserSupport: BrowserSupportComponent;

  getContent(): Options.Content {
    return this._content.getContent();
  }

  getContainer(): Options.Container {
    return this._container.getContainer();
  }

  getHorizontalAlignment(): Options.HorizontalAlignment {
    return this._alignment.getHorizontalAlignment();
  }

  getVerticalAlignment(): Options.VerticalAlignment {
    return this._alignment.getVerticalAlignment();
  }

	render(): ?ReactElement {
    // TODO add browser support back in when we need it.
    return (
      <div>
        <ContentComponent ref={(c) => this._content = c} />
        <ContainerComponent ref={(c) => this._container = c} />
        <AlignmentComponent ref={(c) => this._alignment = c} />
      </div>
    );
	}
}

module.exports = OptionsComponent;
