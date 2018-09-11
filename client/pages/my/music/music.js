// pages/my/music/music.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList:[
      {
        id:0,
      url:'http://pdqyvtjnk.bkt.clouddn.com/C400004bXKxc3Ext2N.m4a',
      name:'大花轿',
      checked:false
      },
      {
        id: 1,
        url: 'http://pdqyvtjnk.bkt.clouddn.com/C400001JNLFm1fOGTZ.m4a',
        name: 'HandClap',
        checked: false
      }, 
      {
        id: 2,
        url: 'http://pdqyvtjnk.bkt.clouddn.com/C400000FT04R4Voybn.m4a',
        name: '今天你要嫁给我',
        checked: false
      },
      {
        id:3,
        url:'http://pdqyvtjnk.bkt.clouddn.com/C400003RkVkQ2ajDeU.m4a',
        name: '咱们结婚吧',
        checked: true
      }
    ]
  },
  radioChange:function(e){
    console.log(e);
    var url = e.detail.value;
    app.globalData.music_src = e.detail.value;
    util.showSuccess('成功设置该歌曲！')
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        if(status ==1){
          wx.playBackgroundAudio({
            dataUrl: app.globalData.music_src,
            title: '',
            coverImgUrl: ''
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var url = res.dataUrl
        console.log(that.data.musicList)
        that.data.musicList.map(v=>{
          if (v.url == url){
            v.checked = true
          }else{
            v.checked = false
          }
        })
        that.setData({
          musicList:that.data.musicList
        })
        console.log(that.data.musicList)
      }
    })
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
  
  }
})