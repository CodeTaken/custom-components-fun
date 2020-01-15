//app.js
const InitPage = require('/utils/InitPage.js')

App({
  onLaunch: function () {
    
  },
  globalData: {
    _isGetUserMsg:false,  // 标记用户是否正在请求用户数据
    _retryRequests:[],    // 待请求队列
    userInfo: {
      OpenId:'oQNCp5WvCI_NIwsst02wy24mMUWQ',
      SessionKey:'ECA8ZKgH/XwVQIWKrC7sJA=='
    }
  },
  Base(opts) {
    InitPage.InitPage(opts)
  }


})