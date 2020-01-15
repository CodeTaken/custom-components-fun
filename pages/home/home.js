const app = getApp()
import { testReq, testReqTwo } from '../../utils/reqList.js'
//const Page = require('../../utils/resetPage.js').resetPage
// const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
    // console.log('HOME >>>>>');
    testReq().then((data)=>{
      console.log(data)
    });
    testReqTwo().then((data) => {
      console.log(data)
    })
    testReq().then((data) => {
      console.log(data)
    });
    testReqTwo().then((data) => {
      console.log(data)
    })


    setTimeout(()=>{
      testReq().then((data) => {
        console.log(data)
      });
      testReqTwo().then((data) => {
        console.log(data)
      })
    },5000)

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