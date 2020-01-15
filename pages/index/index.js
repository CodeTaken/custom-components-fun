// pages/home/home.js
const app = getApp()
var loadMoreView, page
app.Base({

  /**
   * 页面的初始数据
   */
  data: {
    audio:{
      status:false,
      url:'',
      name:'',
      palyStatus:""
    },
    loadImg:'../../images/loading.png',

    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    loadMoreView = this.selectComponent('#loadMoreView');
    console.log('page');
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
    console.log('监听用户下拉动作');
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })

    setTimeout(()=>{
      this.setData({
        isRefreshing: false,
        hasMoreData: false
      })
      wx.stopPullDownRefresh()
    },2000)

    //this.requestData()//数据请求
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
    loadMoreView._loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadMore(){
    var that = this
    console.log('loadMore');
    setTimeout(()=>{
      let items=[{
        title:'第一个',
      },{
          title: '第2个',
      },{
          title: '第3个',
      },]
      that.setData({
        items: items,
        //selectedView: viewType
      })
    },1000)

    // http.get({
    //   url: `/${viewType}/list/${page}/json`,
    //   showLoading: showLoading,
    //   success: (res) => {
    //     var items = that.data.items
    //     if (page == 0) {
    //       items = res.datas
    //       wx.stopPullDownRefresh()
    //     } else {
    //       items = items.concat(res.datas)
    //     }
    //     that.setData({
    //       items: items,
    //       selectedView: viewType
    //     })
    //     loadMoreView.loadMoreComplete(res)
    //   },
    //   fail: () => {
    //     if (page != 0) {
    //       loadMoreView.loadMoreFail()
    //     }
    //   }
    // })
  },
  loadMoreListener: function (e) {
    page += 1
    this.loadData(this.data.selectedView, false)
  },
  clickLoadMore: function (e) {
    console.log('click clickLoadMore');
    this.loadData(this.data.selectedView, false)
  },
})



