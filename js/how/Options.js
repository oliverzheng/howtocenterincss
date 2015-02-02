/* @flow */

var keyMirror = require('keymirror');

var LengthTypes = keyMirror({
  PIXEL: null,
  PERCENTAGE: null,
  EM: null,
});

type LengthType = $Enum<{
  PIXEL: number;
  PERCENTAGE: number;
  EM: number;
}>;

type Length = {
  lengthType: LengthType;
	value: number;
};

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

var HorizontalAlignments = keyMirror({
  LEFT: null,
  CENTER: null,
  RIGHT: null,
});

type HorizontalAlignment = $Enum<{
  LEFT: number;
  CENTER: number;
  RIGHT: number;
}>;

var VerticalAlignments = keyMirror({
  TOP: null,
  MIDDLE: null,
  BOTTOM: null,
});

type VerticalAlignment = $Enum<{
  TOP: number;
  MIDDLE: number;
  BOTTOM: number;
}>;

function px(value: number): Length {
	return {
    lengthType: LengthTypes.PIXEL,
		value: value,
	};
}

function percentage(value: number): Length {
	return {
    lengthType: LengthTypes.PERCENTAGE,
		value: value,
	};
}

function em(value: number): Length {
	return {
    lengthType: LengthTypes.EM,
		value: value,
	};
}

module.exports = {
  px,
  percentage,
  em,
  HorizontalAlignments,
  VerticalAlignments,
  content,
  text,
  container,
  LengthTypes,
};
