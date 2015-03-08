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

	render(): ?ReactElement {
		return (
      <div>
        <ContentComponent ref={(c) => this._content = c} />
        <ContainerComponent ref={(c) => this._container = c} />
        <AlignmentComponent ref={(c) => this._alignment = c} />
        <BrowserSupportComponent ref={(c) => this._browserSupport = c} />
      </div>
    );
	}
}

module.exports = OptionsComponent;
