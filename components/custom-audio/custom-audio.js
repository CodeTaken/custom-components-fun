Component({
  behaviors: [],   // 组件间的共享 类似于 mixins
  properties: {
    audioName: {  // 音频的名称
      type: String,
      value: '',
      observer: function _observerTitle (newVal, oldVal) {}
    },
    audioUrl: {   // 音频的url 
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        if (newVal) {
          this.innerAudioContext.src = newVal
          //this._audioInit();
          this._Init();
        }
       }
    },
    audioAutoplay:{  // 是否自动播放
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) { 
        if (newVal) this.innerAudioContext.autoplay=true
      }
    },
    audioLoop: {  // 是否循环播放
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) {
        if (newVal) this.innerAudioContext.loop=true
      }
    },
    audioDrag: {  // 是否支持进度条拖动
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) {
        
      }
    },
    audioPlayImg:{  // 播放暂停图片
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) {
        let status = newVal ? true:false
        this.setData({ 'audioPlayImgShow': status })
      }
    },
    audioPauseImg:{ //播放暂停图片
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) {
        let status = newVal ? true : false
        this.setData({ 'audioPlayImgShow': status })
       }
    },
    audioStatus: { // 扩展组件，未使用
      type: String,
      value: '',
      observer: function _observerTitle(newVal, oldVal) { }
    }
  },
  data: {
    fixValue:10,  // 用于判断是否显示 05
    innerAudioContext: '',   // 音频对象
    audioPlayImgShow:false,  // 是否展示外部传的图片
    touch:{
      init:false,  // 是否触摸开始
    },
    customAudio: {
      duration:0,   // 音频的总时长
      durationPase:'00:00',  // 显示的总时长
      isPlayAudio: false,  // 是否播放
      currentTime:0,  //当前播放时间
      currentTimePase:'00:00',  //显示的播放时间
      percentage:0,   // 滑块的进度
    },
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () {
      console.log('组件销毁');
      this.innerAudioContext.destroy();
      this.setData({
        innerAudioContext: '',

      })
    },
  },
  created() {
    console.log('组件实例化');
    let that = this;
    this.innerAudioContext = wx.createInnerAudioContext()
    this.query = wx.createSelectorQuery().in(this)
    setTimeout(()=>{
      this.query.select('#progressBar').boundingClientRect(function (res) {
        that.setData({
          'touch.clientWidth': res.width,
        })
        //console.log(that);
        this._queueCb = [];
      }).exec()
    },200)
    
    this.getAudioState()
    //console.log(this);
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  methods: {
    _Init(){
      let that = this;
      // 监听音频可以播放事件
      that.innerAudioContext.onCanplay(()=>{
        that.innerAudioContext.duration
        setTimeout(()=>{
          let _duration = that.innerAudioContext.duration
          //console.log(_duration);
          let min = (parseInt(_duration / 60) < that.data.fixValue) ? '0' + parseInt(_duration / 60) : parseInt(_duration / 60)
          let sec = (parseInt(_duration % 60) < that.data.fixValue) ? '0' + parseInt(_duration % 60) : parseInt(_duration % 60)
          that.setData({
            'customAudio.duration': _duration,
            'customAudio.durationPase': `${min}:${sec}`
          });
          //console.log(that.data);
        },500)
      })
      // 监听音频播放事件
      that.innerAudioContext.onPlay(() => {
        that.setData({ 'customAudio.isPlayAudio': true })
      })
      // 监听音频暂停事件
      that.innerAudioContext.onPause(() => {
        that.setData({ 'customAudio.isPlayAudio': false })
      })
      // 监听音频播放进度更新事件
      that.innerAudioContext.onTimeUpdate(() => {
        //console.log(that.innerAudioContext.currentTime);
        let _currentTime = that.innerAudioContext.currentTime
        let min = (parseInt(_currentTime / 60) < that.data.fixValue) ? '0' + parseInt(_currentTime / 60) : parseInt(_currentTime / 60)
        let sec = (parseInt(_currentTime % 60) < that.data.fixValue) ? '0' + parseInt(_currentTime % 60) : parseInt(_currentTime % 60)
        // 如果 当前时间大于总时间 ？
        let _percentage = (_currentTime / this.data.customAudio.duration)*100
        //console.log(parseInt(_percentage));
        _percentage = !parseInt(_percentage) ? 0 : _percentage
        
        // 如果用户拖动时，不更新进度条
        if (this.data.touch.init){
          that.setData({
            'customAudio.currentTime': _currentTime,
            'customAudio.currentTimePase': `${min}:${sec}`,
            //'customAudio.percentage': `${_percentage}%`
          });
        }else{
          that.setData({
            'customAudio.currentTime': _currentTime,
            'customAudio.currentTimePase': `${min}:${sec}`,
            'customAudio.percentage': `${_percentage}%`
          });
        }

      })
      // 监听音频播放结束事件
      that.innerAudioContext.onEnded(() => {
        // 判断是否循环播放，否的话将状态重置为初始状态。
        if (!this.innerAudioContext.loop){
          //console.log('监听音频播放结束事件');
          that.setData({
            'customAudio.isPlayAudio': false,
            'customAudio.currentTime': 0,
            'customAudio.currentTimePase': `00:00`,
            'customAudio.percentage': `0%`
          })
        }
      })
      // 监听音频加载中事件
      that.innerAudioContext.onWaiting(()=>{
        console.log('onWaiting');
        console.log(that.innerAudioContext);
      })
      // 监听音频加载中事件
      that.innerAudioContext.onError(() => {
        throw new Error("音频加载错误！");
      })
    },
    _audioPlay() {
      if (!this.innerAudioContext) return 
      //更改播放状态
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.play()
      } else {
        this.innerAudioContext.pause()
      }
    },
    _progressStart(e){
      if (!this.data.audioDrag) return
      let that = this
      let _startX = e.touches[0].pageX
      // 进度条的 width 为异步操作。解决方法：间接获取元素当前的宽度，通过百分比来获取
      // this.query.select('#progressted').boundingClientRect(function(res){
      //   this._queueCb=[];
      //   let _left = res.width
      //   that.setData({
      //     'touch.left': _left,
      //   })
      // }).exec()
      let _left = (this.data.touch.clientWidth * (parseFloat(this.data.customAudio.percentage)))/100
      that.setData({
        'touch.init': true,
        'touch.startX': _startX,
        'touch.left': _left,
      })
    },
    _progressMove(e){
      //console.log(this.data.touch);
      if (!this.data.audioDrag) return
      if (!this.data.touch.init) return
      const moveDistance = e.touches[0].pageX - this.data.touch.startX   // 移动的偏移量
      const offsetWidth = Math.min(Math.max(0, moveDistance + this.data.touch.left), this.data.touch.clientWidth)
      if (!offsetWidth) return
      let _percentage = (offsetWidth / this.data.touch.clientWidth)*100
      //console.log(offsetWidth + '_percentage = ' + _percentage);
      // 频繁的更新setData造成堵塞。
      this.setData({
        'customAudio.percentage': `${_percentage}%`
      })
    },
    _progressEnd(e){
      if (!this.data.audioDrag) return
      // // 设置跳转进度，
      const seekTime = (this.data.customAudio.duration * parseFloat(this.data.customAudio.percentage))/100
      if (!seekTime) return
      //console.log('seekTime' + seekTime);
      // 播放时调整进度没反应
      this.innerAudioContext.seek(seekTime)
      this.innerAudioContext.play()
      //console.log(this.innerAudioContext);
      this.setData({
        'touch.init': false,
      })
    },

    getAudioState(){
      let that = this;
      let _playStatus = that.innerAudioContext.paused
      let options = {
        innerAudioContext: that.data.innerAudioContext,
        duration: that.data.customAudio.duration,
        playStatus: _playStatus,
        autoPlay: false,
        loop: false,
      }
      this.triggerEvent('audioStatus', options)
    },
    handleIndexFunction(){
      console.log('handleIndexFunction');
      this.triggerEvent('indexFunction')
    }
  },
  observers: {
  }
})





/*
问题：
  1、进度更新的当前时间大于总时间
  2、播放结束根据是否自动播放、循环播放重置状态表
  3、加载中事件的处理
  4、使用字体文件图标，如何传入
  5、实时获取进度条的方法是异步操作，无法获取到宽度
 */

/* 
扩展：
  1、向外暴露音频的各项状态，如：音频的总时间、当前播放时间、当前状态、是否循环播放、是否自动播放，（播放时间记时） 已扩展
  2、向内传递接收函数，方便内部调用     （不能自动调用，必须手动触发,）
  3、扩展自动播放，循环播放            已扩展
  4、扩展是否能快进、后退的开关        已扩展
  5、扩展播放、暂停的图标及图片        已扩展
  6、扩展播放计时，记录播放真正时间     

*/

/*
子组件向父组件传值
  1、父组件：this.selectComponent('#myAudio')获取子组件所有的数据
  2、子组件绑定一个函数，通过 triggerEvent 传递一个事件给父组件，父组件接受事件获取数据
父组件向自组件传值

 */