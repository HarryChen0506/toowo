// pages/tetris/tetris.js
const { Game } = require('../../lib/tetris/game.js')
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
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];
let nextData = [
  [2, 2, 0, 0],
  [0, 2, 2, 0],
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
    nextData: decorateData(nextData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.game = new Game({
      showData: this.showData,
      refreshNext: this.refreshNext
    });
    this.game.init()
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
    console.log('next', data.data);
    var newData = decorateData(data.data);
    console.log('new', newData)
    this.setData({ nextData: newData })
  },
  // 将数据进行一层对象的包裹
  

  /**
   * 按钮操作
   */
  toRotate: function(){
    console.log(123, this.game)
  },
  toLeft: function(){
    console.log('left', this.data);   
  },
  toRight: function () {

  },
  toDown: function () {

  } 

})