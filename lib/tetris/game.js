/**
 * 游戏核心模块
 */
const { squareFactory } = require('./squareFactory.js');
function getType(obj) {
  //tostring会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
}
function deepClone(data) {
  var type = getType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

function Game(config){
  this.name = 'Tetris';
  let curSquare;  //当前方块
  let nextSquare;  //下一个方块
  let gameData;  // 游戏区数据  

  let init_gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  ]  
  function initData(){
    gameData = deepClone(init_gameData);    
  }
  initData();   // 初始化数据

  const { showData, refreshNext,refreshGame } = config;
  this.showData = showData;
  this.refreshNext = refreshNext;
  this.refreshGame = refreshGame;
  
  

  // 生成随机数
  const createRandomNum =function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  /**
    * 检测点是否合法
    * @param {*} origin 检测方块的原点坐标
    * @param {*} row 待监测方块点的行数
    * @param {*} col 待监测方块点的列数
    */
  function checkDotValid(origin, row, col) {
    var x = origin.x || 0;
    var y = origin.y || 0;
    var maxRow = gameData.length; //最大的行数
    var maxCol = gameData[0].length; //最大列数
    if (x + row < 0) {
      // 超出游戏区上面
      return false
    } else if (x + row >= maxRow) {
      // 超出游戏区下面
      return false
    } else if (y + col < 0) {
      // 超出游戏区左面
      return false
    } else if (y + col >= maxCol) {
      // 超出游戏区右面
      return false
    } else if (gameData[x + row][y + col] === 1) {
      // 该位置已有灰色的方块
      return false
    }
    return true
  }
  /**
     * 检测方块整体是否合法
     * @param {*} origin 方块的原点位置
     * @param {*} data   方块的数据
     */
  function checkSquareValid(origin, data) {    
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j] !== 0) {
          // 该点是实体点
          if (!checkDotValid(origin, i, j)) {
            return false
          }
        }
      }
    }
    return true
  }
  //从方块拷贝数据到游戏区
  function copyData(gameData, curData, origin) {
    // gameData 游戏数据
    // nextData 方块数据
    // 开始位置          
    for (var i = 0; i < curData.length; i++) {
      for (var j = 0; j < curData[i].length; j++) {
        if (checkDotValid(origin, i, j)) {
          gameData[origin.x + i][origin.y + j] = curData[i][j]
        }
      }
    }
  }
  //清空游戏区数据
  function clearData(gameData, curData, origin, value) {
    for (var i = 0; i < curData.length; i++) {
      for (var j = 0; j < curData[i].length; j++) {
        if (checkDotValid(origin, i, j)) {
          gameData[origin.x + i][origin.y + j] = value
        }
      }
    }
  }
  // 刷新页面
  function fresh() {
    clearData(gameData, curSquare.data, curSquare.origin, 0);                 //先清空旧数据
    copyData(gameData, curSquare.data, curSquare.origin)    //拷贝新数据  
    refreshNext(nextSquare.data)
    refreshGame(gameData)
  }

  function _init(){    
    curSquare = squareFactory(createRandomNum(1, 7), createRandomNum(0, 3));  //下一个方块复制给当前
    nextSquare = squareFactory(createRandomNum(1, 7), createRandomNum(0, 3));  //下一个方块复制给当前    
    fresh() 
  }
  //向下 
  function nextDown() {
    clearData(gameData, curSquare.data, curSquare.origin, 0);   //先清空旧数据
    curSquare.down();   //       
    copyData(gameData, curSquare.data, curSquare.origin)    //拷贝新数据
    refreshGame(gameData)          //刷新游戏区
  }
  function _down() {  
    if (curSquare.canDown(checkSquareValid)) {  
      // console.log('合法')    
      nextDown();
      return true
    };
    return false
  }
  //向左
  function nextLeft() {
    clearData(gameData, curSquare.data, curSquare.origin, 0);                  //先清空旧数据
    curSquare.left();   //        
    copyData(gameData, curSquare.data, curSquare.origin)    //拷贝新数据
    refreshGame(gameData)           //刷新游戏区
  }
  function _left() {
    if (curSquare.canLeft(checkSquareValid)) {
      // console.log('合法')
      nextLeft();
    };
  }
  //向右
  function nextRight() {
    clearData(gameData, curSquare.data, curSquare.origin, 0);                  //先清空旧数据
    curSquare.right();   //        
    copyData(gameData, curSquare.data, curSquare.origin)    //拷贝新数据
    refreshGame(gameData)           //刷新游戏区
  }
  function _right() {   
    if (curSquare.canRight(checkSquareValid)) {
      // console.log('合法')
      nextRight();
    };
  }
  //旋转
  function nextRotate() {
    clearData(gameData, curSquare.data, curSquare.origin, 0);                  //先清空旧数据        
    curSquare.rotate();   // 旋转       
    copyData(gameData, curSquare.data, curSquare.origin)    //拷贝新数据
    refreshGame(gameData)          //刷新游戏区
  }
  function _rotate() {    
    if (curSquare.canRotate(checkSquareValid)) {
      // console.log('合法')
      nextRotate();
    };
  }
  // 坠落
  function _fall() {
    while (this.down()) {
      // this.down()
    }
  }
  // 固定当前方块
  function _fixed() {
    // 开始位置          
    for (var i = 0; i < curSquare.data.length; i++) {
      for (var j = 0; j < curSquare.data[i].length; j++) {
        if (checkDotValid(curSquare.origin, i, j)) {
          if (gameData[curSquare.origin.x + i][curSquare.origin.y + j] === 2) {
            gameData[curSquare.origin.x + i][curSquare.origin.y + j] = 1
          }
        }
      }
    }
    refreshGame(gameData)          //刷新游戏区
  }
  // 消分
  function _clearSquare(next) {
    var score = 0;
    for (var i = gameData.length - 1; i > 0; i--) {
      var win = true;   // 默认该行是满的，可以得分
      for (var j = 0; j < gameData[i].length; j++) {
        if (gameData[i][j] !== 1) {
          win = false;
          break;
        }
      }
      if (win) {
        score++;
        // 下移一行
        for (var m = i; m > 0; m--) {
          for (var n = 0; n < gameData[i].length; n++) {
            gameData[m][n] = gameData[m - 1][n];
          }
        }
        // 第一行设为灰色
        for (var k = 0; k < gameData[0].length; k++) {
          gameData[0][k] = 0;
        }
        // 重新回到底行，在做循环判断
        i++;
      }
    }
    typeof next === 'function' && next(score)
  }
  // 执行下一条
  function _runNext() {
    // console.log('next--');
    curSquare = nextSquare;
    nextSquare = squareFactory(createRandomNum(1, 7), createRandomNum(0, 3));  //下一个方块复制给当前
    refreshNext(nextSquare.data)  //刷新下个方块
  }
  // 检测游戏是否结束
  function _checkGameOver(){
    var isGameOver = false;
    for(let i=0; i<gameData[0].length; i++){
      if (gameData[1][i]===1){
        //第二行有灰色方块表示游戏结束
        isGameOver = true
      }
    }
    return isGameOver
  }
  // 结束
  function _end(){
    initData(); //重置数据
    refreshGame(gameData)          //刷新游戏区    
  }
  // 重玩
  function _reset(){
    initData(); //重置数据
    this.init()
  }

  // 暴露接口
  this.init = _init;
  this.down = _down;  
  this.left = _left;
  this.right = _right;
  this.rotate = _rotate;
  this.fall = _fall; 
  this.fixed = _fixed;
  this.clearSquare = _clearSquare;
  this.runNext = _runNext;
  this.checkGameOver = _checkGameOver;
  this.end = _end;
  this.reset = _reset;
}

module.exports = {
  Game: Game
}