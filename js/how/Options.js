/* @flow */

var keyMirror = require('keymirror');

class LengthType {
  cssUnit: string;

  constructor(cssUnit: string) {
    this.cssUnit = cssUnit;
  }

  toString(): string {
    return this.cssUnit;
  }
}

LengthType.PIXEL = new LengthType('px');
LengthType.PERCENTAGE = new LengthType('%');
LengthType.EM = new LengthType('em');

LengthType.AllTypes = [
  LengthType.PIXEL,
  LengthType.PERCENTAGE,
  LengthType.EM,
];

class Length {
  value: number;
  lengthType: LengthType;

  constructor(value: number, lengthType: LengthType) {
    this.value = value;
    this.lengthType = lengthType;
  }

  multiple(multiplier: number): Length {
    return new Length(this.value * multiplier, this.lengthType);
  }

  add(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value + length.value, this.lengthType);
  }

  subtract(length: Length): Length {
    if (length.lengthType !== this.lengthType) {
      throw new Error('Length types have to be the same');
    }
    return new Length(this.value - length.value, this.lengthType);
  }

  toString(): string {
    return this.value.toString() + this.lengthType.toString();
  }

  static px(value: number): Length {
    return new Length(value, LengthType.PIXEL);
  }

  static pct(value: number): Length {
    return new Length(value, LengthType.PERCENTAGE);
  }

  static em(value: number): Length {
    return new Length(value, LengthType.EM);
  }
}

// The outer parent container is always of block container. It makes no sense to
// center within an inline container - the container would just shrink to the
// width of the content.
//
// The inner container is either inline-block or block. If a paragraph of text
// is to be centered, it should be put into an inline-block first.
type Text = {
  lines: ?number;
  lineHeight: ?Length;
};

class Content {
  width: ?Length;
  height: ?Length;
  text: ?Text;

  constructor(width: ?Length, height: ?Length, text: ?Text) {
    this.width = width;
    this.height = height;
    this.text = text;
  }

  static text(lines: ?number, lineHeight: ?Length): Content {
    var height = null;
    if (lines && lineHeight) {
      height = new Length(lineHeight.value * lines, lineHeight.lengthType);
    }
    return new Content(null, height, {lines, lineHeight});
  }
}

class Container {
  width: ?Length;
  height: ?Length;

  constructor(width: ?Length, height: ?Length) {
    this.width = width;
    this.height = height;
  }
}

class HorizontalAlignment {}
HorizontalAlignment.LEFT = new HorizontalAlignment();
HorizontalAlignment.CENTER = new HorizontalAlignment();
HorizontalAlignment.RIGHT = new HorizontalAlignment();

class VerticalAlignment {}
VerticalAlignment.TOP = new VerticalAlignment();
VerticalAlignment.MIDDLE = new VerticalAlignment();
VerticalAlignment.BOTTOM = new VerticalAlignment();

module.exports = {
  Length,
  LengthType,
  HorizontalAlignment,
  VerticalAlignment,
  Content,
  Container,
};
