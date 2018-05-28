// pages/demo/demo.js
import WxTouchEvent from '../../lib/wx-touch-event.js';
let demoTouchEvent = new WxTouchEvent();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {
      longitude: 113.324520,
      latitude: 23.099994
    },
    markers: [], 
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    x: 10,
    y: 10,
    boxStyleStr: '',
    boxStyle: {
      translate: {
        x:0,
        y:0,
        z:0
      },
      rotate: {
        x: 0,
        y: 0,
        z: 0,
        angle: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 0
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: (res)=> {
        let { latitude, longitude } = res;
        this.setData({
          location: {
            latitude,
            longitude
          },
          markers: [{
            iconPath: "/assets/location.jpg",
            id: 0,
            latitude,
            longitude,
            width: 20,
            height: 20
          }],
        })
      }
    })

    this.demoTouchEvent = demoTouchEvent;
    this.demoTouchEvent.bind({//初始化后绑定事件
        swipe: function(e) {
            // console.log(e);           
        }.bind(this),
        doubleTap: function(e) {
            // console.log(e);
        },
        tap: function(e) {
            // console.log(e);
        }.bind(this),
        longTap: function(e) {
            // console.log(e);
        },
        rotate: function(e) {
            // console.log(e)
            this.changeRotate(e)
        }.bind(this),
        pinch: function(e) {
            // console.log(e);
            this.changeScale(e)
        }.bind(this),
        pressMove: function(e) {
          // console.log('pressMove', e);
          this.changeTranslate(e)
        }.bind(this),
    })
    
  },
  // 手势
  touchStart: demoTouchEvent.start.bind(demoTouchEvent),
  touchMove: demoTouchEvent.move.bind(demoTouchEvent),
  touchEnd: demoTouchEvent.end.bind(demoTouchEvent),
  touchCancel: demoTouchEvent.cancel.bind(demoTouchEvent),
  // 改变位置
  changeTranslate: function (e) {
    if(e.type==='touchmove'){
      console.log('移动', e.type, e);
      const {boxStyle} = this.data;
      const {translate, rotate, scale} = boxStyle;
      this.setData({
        boxStyle: {
          translate: {
            x: translate.x + e.deltaX,
            y: translate.y + e.deltaY,
            z: translate.z
          },
          rotate: {
            x: rotate.x,
            y: rotate.y,
            z: rotate.z,
            angle: rotate.angle
          },
          scale: {
            x: scale.x,
            y: scale.y,
            z: 0
          }
        }
      })
      // this.updateStyle()
      this.requestElementUpdate()
    }
  },
  // 改变大小
  changeScale: function (e) {    
    if(e.type==='pinch'){
      console.log('缩放', e.type, e)    
      const {boxStyle} = this.data;
      const {translate, rotate, scale} = boxStyle;
      this.setData({
        boxStyle: {
          translate: {
            x: translate.x,
            y: translate.y,
            z: translate.z
          },
          rotate: {
            x: rotate.x,
            y: rotate.y,
            z: rotate.z,
            angle: rotate.angle
          },
          scale: {
            x: e.scale,
            y: e.scale,
            z: 0
          }
        }
      })
      this.requestElementUpdate()
    }
    // console.log('data', this.data.boxStyle)
  },
  // 改变旋转
  changeRotate: function (e) {
    if(e.type==='rotate'){
      console.log('旋转', e.type, e)
    }
  },
  updateStyle: function () {
    let transform = this.data.boxStyle;
    var value = [
        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
        'scale(' + transform.scale.x + ', ' + transform.scale.y + ')',
        'rotate('+ transform.rotate.angle + 'deg)'
    ];
    let boxStyleStr = 'transform:' + value.join(' ')
    this.setData({
      boxStyleStr: boxStyleStr
    })
    this.ticking = false
  },
  reqAnimationFrame: function (callback) {
    if(this.timerId){
      clearInterval(this.timerId)
    }
    this.timerId = setTimeout(callback, 1000 / 30)
  },
  requestElementUpdate: function () {
    if(!this.ticking) {
      this.reqAnimationFrame(this.updateStyle);
      this.ticking = true;
    }
  }



})