//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
      
    },
    globalData: {
      openid:null,
      music_src:'http://pdqyvtjnk.bkt.clouddn.com/C400003RkVkQ2ajDeU.m4a'
    }
})