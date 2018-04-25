/**
 * 游戏核心模块
 */
const { squareFactory } = require('./squareFactory.js');

function Game(config){
  this.name = 'Tetris';
  let curSquare;  //当前方块
  let nextSquare;  //下一个方块

  const { showData, refreshNext } = config;
  this.showData = showData;
  this.refreshNext = refreshNext;
  
  

  // 生成随机数
  const createRandomNum =function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function _init(){    
    curSquare = squareFactory(createRandomNum(1, 7), createRandomNum(0, 3));  //下一个方块复制给当前
    nextSquare = squareFactory(createRandomNum(1, 7), createRandomNum(0, 3));  //下一个方块复制给当前
    this.refreshNext(curSquare)
  }

  // 暴露接口
  this.init = _init;
}

module.exports = {
  Game: Game
}