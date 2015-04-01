/* @flow */

var Options = require('../Options');

type Check = (
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment
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
      (content, container, horizontalAlignment, verticalAlignment) => {
        return requirements.every(
          (requirement) => requirement.check(content, container, horizontalAlignment, verticalAlignment)
        );
      }
    );
  }

  static any(requirements: Array<Requirement>): Requirement {
    return new Requirement(
      null,
      (content, container, horizontalAlignment, verticalAlignment) => {
        return requirements.some(
          (requirement) => requirement.check(content, container, horizontalAlignment, verticalAlignment)
        );
      }
    );
  }
}

module.exports = Requirement;
