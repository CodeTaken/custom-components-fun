const regeneratorRuntime = require('../lib/regenerator-runtime/runtime')
const app = getApp()
import { UrlBase, GLOBALAUTH } from '/config.js'
import { handleTimeOut } from '/util.js'
/*
* 用户的 opendid 存储与全局变量 pp.globalData.userInfo 中
*
*
*/



/*
* 封装基础的请求
* 有用户数据且wx.checkSession 状态是成功，则正常请求
* 反之重新登录wx.login
* 逻辑处理：登录时将请求存到一个数组队列中，想办法让这个请求处于等待中，等 openid 返回之后，来处理队列的请求，返回数据
*/
const baseRequest = async function  (options){
  if (app.globalData.userInfo && app.globalData.userInfo.OpenId && app.globalData._userSessionStatus){
    return Promise.resolve(await request(options)) 
  } else {
    //登录:将请求队列存储，msg 拿到后释放
    return  new Promise(resolve => {
      app.globalData._retryRequests.push(options)
      if (!app.globalData._isGetUserMsg) {
        getLogin().then((res)=>{
          if (!res){
            resolve(handleRetryRequests())
            app.globalData._retryRequests = []
          }
        })
      }
    })
  }

}


/*
* options 请求接口的参数
*
*/
const request = async function (options){
  let optionsArr = Array.isArray(options) ? options : [options]
  return new Promise((resolve, reject) => {
       optionsArr.forEach((option) => {
            let method = option.method | 'GET'
            // 设置 openid sk 的 cookie 或 参数固定字段 document.cookie = 'openid_cookie='+ app.globalData.openid ;
            let data = Object.assign({
                openid: app.globalData.userInfo.OpenId,
                sk: app.globalData.userInfo.SessionKey
            }, option.data)
            // 请求接口
            wx.request({
              url: UrlBase + option.url,
              data: data,
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: method,
              success: function (res) {
                //console.log('request>>>>ok');
                resolve(res.data)
              },
              fail: function (err) {
                wx.hideLoading()
                // 接口请求失败，可做 404 网络异常处理
                handleTimeOut(err)
                reject(err)
              }
            });
        }) 
  })

 
  // let method = options.method | 'GET'
  // // 设置 openid sk 的 cookie 或 参数固定字段 document.cookie = 'openid_cookie='+ app.globalData.openid ;
  // let data = Object.assign({
  //   openid :app.globalData.userInfo.OpenId,
  //   sk: app.globalData.userInfo.SessionKey
  // }, options.data)
  // // 请求接口
  // return await new Promise((resolve,reject)=>{
  //   wx.request({
  //     url: UrlBase + options.url,
  //     data: data,
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     method: method,
  //     success: function (res) {
  //       //console.log('request>>>>ok');
  //       resolve(res.data)
  //     },
  //     fail: function (err) {
  //       wx.hideLoading()
  //       // 接口请求失败，可做 404 网络异常处理
  //       handleTimeOut(err)
  //       reject(err)
  //     }
  //   });
  // }) 


}


/*
* 检查session的必要性：
*     如使用全局变量来存储session,则不需要使用该函数，
*     如使用本地存储，则需要开启session检查
*/
function getSessionStatus(){
  return new Promise((resolve) => {
      wx.checkSession({
        success(res) { app.globalData._userSessionStatus = true; resolve(true) },
        fail(err) { app.globalData._userSessionStatus = false; resolve(false) }
      })
    })
}

/*
*登录获取用户code
*/
function getLogin(){
  // 正在请求code
  app.globalData._isGetUserMsg = true;
  return new Promise((resolve)=>{
    wx.login({
      success: res => {
        wx.request({
          method: 'POST',
          url: UrlBase + 'api/wechat/MAUserInfo', 
          data: { code: res.code },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            app.globalData._isGetUserMsg = false; 
            handleUserMessage(res.data)
            //console.log('getLogin');
            resolve(res.data.Data);
          },
          fail: function (res) {
            app.globalData._isGetUserMsg = false; 
            handleTimeOut(res.data)
          }
        })
      }
    })
  })
  
}


/*
* data:后台返回字段
* 在全局保存用户信息
*/
function handleUserMessage(data){
  app.globalData._userSessionStatus = true;
  app.globalData._isGetUserMsg = false; 
  //app.globalData.MAUserInfo = res.data.Data;
  //app.globalData.MAUserLock = false;
  // 是否登录
  //mabase.App().globalData.MARegisterId = res.data.Data.MARegisterId;
}

/*
* 处理队列中的请求，
* 问题：阻塞中断
*/
const handleRetryRequests = async function () {
  return Promise.resolve(request(app.globalData._retryRequests))
}



module.exports = {
  baseRequest
}
