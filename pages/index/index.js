// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:{
      status:false,
      url:'',
      name:'',
      palyStatus:""
    }
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
    setTimeout(()=>{
      this.setData({
        'audio.status':false,
        'audio.url':'https://netsuite2018.blob.core.chinacloudapi.cn/resource/Audio/4a6fdb2d-5d5d-4ec8-b301-769dc76929bc.mp3',
        'audio.name':'测试音频',
        'audio.palyStatus':true
      })
    },1000)

    // 获取组件内部所有数据及方法
    var component = this.selectComponent('#myAudio');
    //console.log(component);

   //this.outsideFun(e)
  },
  outsideFun(e){
    console.log('我是外部的方法，可以获取到组件内部传递的数据！');
    console.log(e);
  },
  fixFun(){
    console.log('我是外部的函数，需要传递到自组件中。');
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