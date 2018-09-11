// pages/bless/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
const AppId = 'wx30b9a490310edd9e'
const AppSecret = '1c7e4cdbf21138cb6e556c78ed93b9fb'
Page({
  data: {
    userInfo: {},
    inputValue: '',
    zanLog: [],
    chatList: [],
    openid:''
  },
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              })
              console.log('bless', res)
            }
          })
        }
      }
    })
    that.getPraiseList();
    that.getBlessList();

    //获取用户唯一openid
    wx.login({
      success: function (res) {
        if (res.code) {
          qcloud.request({
            url: `${config.service.host}/weapp/openid`,
            login: false,
            method: 'POST',
            data: {
              js_code: res.code
            },
            success(result) {
              that.data.openid = result.data.data.openid
            },
            fail(error) {
              console.log(error);
            }
          })
        }
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value.replace(/\s+/, '')
    })
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
    this.getPraiseList()
  },
  // 获取评论列表
  getPraiseList: function () {
    var that = this
    wx.showLoading('loading')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/commentfetch`,
      login: false,
      success(result) {
        wx.hideLoading()
        result.data.data.map(v => {
            return v.ctime = util.formatZone(v.ctime)
          })
        that.setData({
          chatList: result.data.data
        })
       
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  getBlessList:function(){
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/blessfetch`,
      login: false,
      success(result) {
        that.setData({
          zanLog: result.data.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  loadMoreFriends: function (e) {
    wx.navigateTo({
      url: 'blessDetail/blessDetail'
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
      data: { 'name': name, 'face': face, 'openid': that.data.openid},
      method: 'POST',
      success(result) {
        util.showSuccess('谢谢您的祝福！');
        that.setData({
          zanLog: [{ 'name': name, 'face': face, 'openid': that.data.openid },...that.data.zanLog]
        })
        console.log(result, userInfo, that.data.openid)
      },
      fail(error) {
        console.log(error, userInfo, that.data.openid)
        util.showSuccess('您已经送过祝福咯！')
      }
    })
  },
  zan: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    qcloud.request({
      url: `${config.service.host}/weapp/zan`,
      data: { 'id': id },
      method: 'POST',
      success(result) {
        that.data.chatList[index].zannum = parseInt(that.data.chatList[index].zannum) + 1;
        that.setData({
          chatList: that.data.chatList
        })
        console.log(that.data.chatList)

      },
      fail(error) {
        console.log('request fail', error);
      }
    })
  },
  foo: function () {
    var that = this;
    if (that.data.inputValue) {
      //留言内容不是空值

      var userInfo = that.data.userInfo;
      var name = userInfo.nickName;
      var face = userInfo.avatarUrl;
      var words = that.data.inputValue;
      qcloud.request({
        url: `${config.service.host}/weapp/comment`,
        data: { 'name': name, 'face': face, 'words': words },
        method: 'POST',
        success(result) {
          util.showSuccess('评论成功！')
          console.log(result)
          that.setData({
            chatList: [{ 'name': name, 'face': face, 'words': words, 'ctime': util.formatTime(new Date())},...that.data.chatList]
          })
        },
        fail(error) {
          util.showModel('评论失败', error);
          console.log('request fail', error);
        }
      })
    } else {
      //Catch Error
      wx.showModal({
        title: '提示',
        content: '亲，您还没有填写内容',
        showCancel: false
      })
    }
    that.setData({
      inputValue: ''//将data的inputValue清空
    });
    return;
  }
})