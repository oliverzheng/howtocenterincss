/* @flow */

var Options = require('../Options');

type Check = (
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment,
  browserSupport: Options.BrowserSupport
) => bool;

class Requirement {
  description: ?string;
  check: Check;

  constructor(description: ?string, check: Check) {
    this.description = description;
    this.check = check;
  }

  static all(requirements: Array<Requirement>): Requirement {
    return new Requirement(
      null,
      (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
        return requirements.every(
          (requirement) => requirement.check(content, container, horizontalAlignment, verticalAlignment, browserSupport)
        );
      }
    );
  }

  static any(requirements: Array<Requirement>): Requirement {
    return new Requirement(
      null,
      (content, container, horizontalAlignment, verticalAlignment, browserSupport) => {
        return requirements.some(
          (requirement) => requirement.check(content, container, horizontalAlignment, verticalAlignment, browserSupport)
        );
      }
    );
  }
}

module.exports = Requirement;
