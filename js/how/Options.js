/* @flow */

var keyMirror = require('keymirror');

class LengthType {}

LengthType.PIXEL = new LengthType();
LengthType.PERCENTAGE = new LengthType();
LengthType.EM = new LengthType();

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
type Content = {
	width: ?Length;
	height: ?Length;
  text: ?{ lines: ?number; lineHeight: ?Length };
};

function content(
  width: ?Length,
  height: ?Length,
  text: ?{ lines: ?number; lineHeight: ?Length }
): Content {
  return {
    width,
    height,
    text,
  };
}

function text(lines: ?number, lineHeight: ?Length): Content {
  var height = null;
  if (lines && lineHeight) {
    height = {
      lengthType: lineHeight.lengthType,
      value: lineHeight.value * lines,
    };
  }
  return content(null, height, {lines, lineHeight});
}

type Container = {
	width: ?Length;
	height: ?Length;
};

function container(width: ?Length, height: ?Length): Container {
  return {
    width,
    height,
  };
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
  content,
  text,
  container,
};
