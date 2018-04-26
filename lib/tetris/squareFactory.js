/**
 * 方块构造工厂
 */
const { Square } = require('./square.js')

var SQUARE_1 = 'SQUARE_1';
var SQUARE_2 = 'SQUARE_2';
var SQUARE_3 = 'SQUARE_3';
var SQUARE_4 = 'SQUARE_4';
var SQUARE_5 = 'SQUARE_5';
var SQUARE_6 = 'SQUARE_6';
var SQUARE_7 = 'SQUARE_7';
var squareArray = {
  [SQUARE_1]: [
    [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_2]: [
    [
      [0, 2, 0, 0],
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 0, 0, 0],
      [2, 2, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 2, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_3]: [
    [
      [2, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_4]: [
    [
      [2, 2, 0, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [2, 2, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 0, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [2, 2, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_5]: [
    [
      [0, 2, 2, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 0, 0, 0],
      [2, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 2, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 0, 0, 0],
      [2, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_6]: [
    [
      [2, 2, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 2, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [2, 2, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 0, 0, 0],
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [SQUARE_7]: [
    [
      [0, 2, 2, 0],
      [0, 0, 2, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 2, 0],
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ],
    [
      [2, 2, 2, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
}

// 生成随机数
function createRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function SquareFactory(type) {
  Square.call(this);
  this.dataList = squareArray[type]
}
SquareFactory.prototype = Square.prototype;

function squareFactory(type, dir) {
  var square = null;
  switch (type) {
    case 1:
      square = new SquareFactory(SQUARE_1);
      break;
    case 2:
      square = new SquareFactory(SQUARE_2);
      break;
    case 3:
      square = new SquareFactory(SQUARE_3);
      break;
    case 4:
      square = new SquareFactory(SQUARE_4);
      break;
    case 5:
      square = new SquareFactory(SQUARE_5);
      break;
    case 6:
      square = new SquareFactory(SQUARE_6);
      break;
    case 7:
      square = new SquareFactory(SQUARE_7);
      break;
    default:
      break;
  }
  square.origin = {
    x: 0,
    y: createRandomNum(0,6)
  }
  square.rotate(dir);
  return square;
}


module.exports = {
  squareFactory: squareFactory
}