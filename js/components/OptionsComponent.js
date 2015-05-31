/** @flow */

var invariant = require('invariant');

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
    var content = this._content.getContent();
    invariant(content, 'No content');
    return content;
  }

  getContainer(): Options.Container {
    var container = this._container.getContainer();
    invariant(container, 'No container');
    return container;
  }

  getHorizontalAlignment(): Options.HorizontalAlignment {
    var alignment = this._alignment.getHorizontalAlignment();
    invariant(alignment, 'No horizontal alignment');
    return alignment;
  }

  getVerticalAlignment(): Options.VerticalAlignment {
    var alignment = this._alignment.getVerticalAlignment();
    invariant(alignment, 'No vertical alignment');
    return alignment;
  }

  getBrowserSupport(): Options.BrowserSupport {
    return this._browserSupport.getBrowserSupport();
  }

  setOptions(
    content: Options.Content,
    container: Options.Container,
    horizontalAlignment: Options.HorizontalAlignment,
    verticalAlignment: Options.VerticalAlignment,
    browserSupport: Options.BrowserSupport
  ) {
    this._content.setContent(content);
    this._container.setContainer(container);
    this._alignment.setHorizontalAlignment(horizontalAlignment);
    this._alignment.setVerticalAlignment(verticalAlignment);
    this._browserSupport.setBrowserSupport(browserSupport);
  }

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
