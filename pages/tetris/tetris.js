// pages/tetris/tetris.js
const { Game } = require('../../lib/tetris/game.js');
const { Audio } = require('../../lib/audio/audio.js');
let gameData = [
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
let nextData = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
function decorateData(data) {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    let row = [];
    for (let j = 0; j < data[i].length; j++) {
      let obj = {}
      obj.value = data[i][j];
      obj.id = i + '_' + j;
      row.push(obj);
    }
    newData.push(row)
  }
  return newData
};

Page({
  data: {
    gameData: decorateData(gameData),
    nextData: decorateData(nextData),
    status: 'pause',   //默认暂停
    timerId: null,     //定时器Id
    score: 0,          //得分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.voice = new Audio();
    this.game = new Game({
      showData: this.showData,
      refreshNext: this.refreshNext,
      refreshGame: this.refreshGame,
      
    });
    this.game.init();
    this.play();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.run()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 数据操作
   */
  showData: function (data) {
    console.log('data', data)
  },
  refreshNext: function(data){
    // console.log('next', data);
    var newData = decorateData(data);
    this.setData({ nextData: newData })
  },
  refreshGame: function (data) {
    // console.log('game', data);
    var newData = decorateData(data);
    this.setData({ gameData: newData })
  },
  /**
   * 控制系统
   */
  //计算分数 
  calScore: function(level){    
    let getScore = 0;   
    switch(level) {
      case 1:
        getScore = 10;
        break;
      case 2:
        getScore = 30;
        break;
      case 3:
        getScore = 60;
        break;
      case 4:
        getScore = 80;
        break;
      default:
        break
    }
    return getScore
  },
  autoMove: function () {
    if (!this.game.down()) {
      // 如果不能继续向下，则将当前方块固定在底部
      this.game.fixed();
      // 检测能否消分
      this.game.clearSquare((data)=> {
        if (data > 0) {
          this.setData({
            score: this.data.score + this.calScore(data)
          })
        }
      });
      //检测游戏是否结束
      if(this.game.checkGameOver()){
        console.log('结束')
        this.end()
      }else {
        // 执行下一条
        this.game.runNext();
      }       
    }   
  },
  //开始
  run: function(){
    this.setData({
      status:'run'
    });
    // console.log(status)
    if(!this.data.timerId){
      let timerId = setInterval(this.autoMove, 1000)
      this.setData({
        timerId: timerId
      });
    }        
  },
  // 暂停
  pause: function() {
    this.setData({
      status: 'pause'
    });
    // console.log(status);
    clearInterval(this.data.timerId);
    this.setData({
      timerId: null
    })
  },
  // 开关按钮
  play: function (){
    if(this.data.status==='run') {
      // 暂停
      // console.log('暂停')
      this.pause()
    }else{
      // 开始
      // console.log('开始')
      this.run()
    }
  },
  // 结束按钮
  end: function(){
    this.setData({
      status: 'end'
    });
    clearInterval(this.data.timerId);
    this.setData({
      timerId: null
    })
    this.game.end();
  },
  // 重玩
  reset: function(){
    // console.log('重玩');
    this.game.reset();
    this.setData({
      score: 0
    })
    this.run();
  },
  

  /**
   * 按钮操作
   */
  toRotate: function(){
    this.voice.play();
    this.game.rotate();
  },
  toLeft: function(){
    this.game.left();
  },
  toRight: function () {
    this.game.right()
  },
  toDown: function () {    
    this.game.down()
  },
  toFall: function () {
    this.game.fall()
  },
  

})