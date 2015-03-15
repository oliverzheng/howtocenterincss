/* @flow */

var Options = require('../Options');

type Check = (
  content: Options.Content,
  container: Options.Container,
  horizontalAlignment: Options.HorizontalAlignment,
  verticalAlignment: Options.VerticalAlignment
) => bool;

class Requirement {
  description: string;
  check: Check;

  constructor(description: string, check: Check) {
    this.description = description;
    this.check = check;
  }
}

module.exports = Requirement;
