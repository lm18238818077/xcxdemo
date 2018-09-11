
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
    userInfo: {},
    zanLog: [],
  },
  onLoad: function (options) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    });
    that.getBlessList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBlessList()
  },
 
  getBlessList: function () {
    var that = this
    wx.showLoading('loading')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/blessfetch`,
      login: false,
      success(result) {
        wx.hideLoading()
        that.setData({
          zanLog: result.data.data
        })
        console.log(that.data.zanLog)
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    //console.log(that.data);
    return {
      title: '诚意邀请你参加我们的婚礼',
      imageUrl: 'http://pdqyvtjnk.bkt.clouddn.com/Z1802250033_021.jpg',
      path: "pages/index/index",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  bless: function () {
    var that = this;

    var userInfo = that.data.userInfo;
    var name = userInfo.nickName;
    var face = userInfo.avatarUrl;
    qcloud.request({
      url: `${config.service.host}/weapp/bless`,
      data: { 'name': name, 'face': face, openid: app.globalData.openid },
      method: 'POST',
      success(result) {
        util.showSuccess('谢谢您的祝福！');
        that.setData({
          zanLog: [...that.data.zanLog, { 'name': name, 'face': face, openid: app.globalData.openid }]
        })
      },
      fail(error) {
        util.showSuccess('您已经送过祝福咯！')
      }
    })
  }
})