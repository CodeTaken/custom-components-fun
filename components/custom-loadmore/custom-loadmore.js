Component({
  behaviors: [],   // 组件间的共享 类似于 mixins
  properties: {
    loadImg: {  // 加载更多的图标
      type: String,
      value: '',
      observer: function _observerTitle (newVal, oldVal) {}
    },
    msHasData: {   // 是否还有数据
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) {
        
      }
    },
    loadText:{  // 提示文字
      type: String,
      value: '加载中...',
      observer: function _observerTitle(newVal, oldVal) { 
       
      }
    },
    // 加载失败的显示文本
    failText: {
      type: String,
      value: '加载失败, 请点击重试!'
    },
    
  },
  data: {
    showThis: true,
    text: '',
    showIcon: true,
    isLoading: false
  }, 

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () {
      
    },
  },
  created() {
    let that = this;

    
    
    
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  methods: {


    //加载更多的入口方法, 直接在page中使用时请在onReachBottom() 方法中调用这个方法, 并实现loadMoreListener方法去获取数据
    _loadMore: function () {
      console.log('properties', this.properties)
      if (!this.properties.hasMore) {
        console.log('load more finish')
        return
      }
      if (this.data.isLoading) {
        console.log('loading ...')
        return
      }
      this.setData({
        isLoading: true
      })
      this.triggerEvent('loadMoreListener')
    },
    //加载完成, 传入hasMore 
    _loadMoreComplete: function (data) {
      var hasMore = data.curPage < data.pageCount && data.pageCount != 1
      var text = '', showThis = false, showIcon = false

      if (hasMore) {
        showIcon = true
        showThis = true
        text = this.properties.loadingText
      } else if (this.properties.finishText.length > 0) {
        text = this.properties.finishText
        showThis = true
      }
      this.setData({
        hasMore: hasMore,
        text: text,
        showIcon: showIcon,
        showThis: showThis
      })
      //界面渲染延迟, 避免列表还未渲染完成就再次触发 loadMore 方法
      setTimeout(function () {
        this.setData({
          isLoading: false
        })
      }.bind(this), this.properties.listRenderingDelay)
    },
    // 加载失败
    _loadMoreFail: function () {
      this.setData({
        showIcon: false,
        text: this.properties.failText
      })
      //界面渲染延迟, 避免列表还未渲染完成就再次触发 loadMore 方法
      setTimeout(function () {
        this.setData({
          isLoading: false
        })
      }.bind(this), this.properties.listRenderingDelay)
    },
    //点击 loadmore 控件时触发, 只有加载失败时才会进入页面回调方法
    _clickLoadMore: function () {
      console.log('click _clickLoadMore');
      if (this.data.text != this.properties.failText) return
      this.setData({
        showIcon: true,
        text: this.properties.loadingText,
        isLoading: true
      })
      this.triggerEvent('clickLoadMore')
    },
  },
  observers: {
  }
})





