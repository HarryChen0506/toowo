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
    highestScore: 0,   //历史最高分
    buttonActive: {
      left: false,
      right: false,
      rotate: false,
      down: false,
      fall: false
    }
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
    this.getHighestScore();
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
  // 获取历史最高分
  getHighestScore: function(){
    let highestScore;
    wx.getStorage({
      key: 'highestScore',
      complete:  (res)=> {
        highestScore = res.data||0;
        this.setData({
          highestScore: highestScore
        })
      }
    })
  },
  //保存历史最高分
  saveHighestScore: function(oldScore, newScore){
    if (newScore > oldScore){
      wx.setStorage({
        key: "highestScore",
        data: newScore
      })
    }   
  },
  autoMove: function () {
    if (!this.game.down()) {
      // 如果不能继续向下，则将当前方块固定在底部
      this.game.fixed();
      // 检测能否消分
      this.game.clearSquare((data)=> {
        if (data > 0) {
          this.longShock();  
          this.setData({
            score: this.data.score + this.calScore(data)
          })
          // 保存历史记录
          this.saveHighestScore(this.data.highestScore, this.data.score)
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
    this.getHighestScore();
    this.run();
  },
  /** 
   * 震动
   */
  shortShock: function(){
    wx.vibrateShort({
      success: function (res) {
        // console.log('res', res)
      }
    })
  },
  longShock: function () {
    wx.vibrateLong({
      success: function (res) {
        // console.log('res', res)
      }
    })
  },
  /**
   * 按钮操作
   */
  toRotate: function(){
    this.shortShock();    
    this.game.rotate();
  },
  toLeft: function(){
    this.shortShock(); 
    this.game.left();
  },
  toRight: function () {
    this.shortShock(); 
    this.game.right()
  },
  toDown: function () { 
    this.shortShock();    
    this.game.down()
  },
  toFall: function () {
    this.shortShock(); 
    this.game.fall()
  },
  /**
   * 改变按钮样式
   */
  changeButtonStyle: function(e){
    const { button } = e.currentTarget.dataset;
    this.setData({
      buttonActive: this.calButtonStyle(button, this.data.buttonActive)
    })
    // console.log(this.data.buttonActive)
  },
  // 计算按钮是否active
  calButtonStyle: function(type, data){
    let buttonActive = Object.assign({}, data);  
    switch(type){
      case 'BUTTON_LEFT':
        buttonActive.left = !buttonActive.left;
        break;
      case 'BUTTON_RIGHT':
        buttonActive.right = !buttonActive.right;
        break;
      case 'BUTTON_ROTATE':
        buttonActive.rotate = !buttonActive.rotate;
        break;
      case 'BUTTON_DOWN':
        buttonActive.down = !buttonActive.down;
        break;
      case 'BUTTON_FALL':
        buttonActive.fall = !buttonActive.fall;
        break;
      default:
        break;
    }
    return buttonActive
  }
  

})