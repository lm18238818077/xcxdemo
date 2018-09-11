//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

var api = require('../../api/api.js')

Page({
  data: {
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    userid: '',
    passwd: '',
    angle: 0
  },
  onLoad: function () {
    var that = this
    that.setData({
      //图片地址
      wave: api.splashWave,
      loading: api.splashLoading
    })

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })

  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },
  //进入主页面
  goHome: function () {
    wx.switchTab({
      url: '../home/home'
    });
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  getUserInfo() {//同意授权，获取用户信息，encryptedData是加密字符串，里面包含unionid和openid信息
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo;
        app.globalData.encryptedData = res.encryptedData;
        app.globalData.iv = res.iv;

        console.log(res)
        this.goHome()
      }
    })
  },
})
