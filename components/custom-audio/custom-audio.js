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
    audioPlay:{  // 是否自动播放
      type: String,
      value: false,
      observer: function _observerTitle(newVal, oldVal) { 
        //if (newVal) this.innerAudioContext.autoplay=true
      }
    },
    audioStatus: {
      type: String,
      value: '',
      observer: function _observerTitle(newVal, oldVal) { }
    }
  },
  data: {
    fixValue:10,  // 用于判断是否显示 05
    code: '',
    innerAudioContext: '',
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


      durationIntval: null,
      
      audioSeek: 0,
      audioDuration: 0,     // 真是播放时间
      showTime1: '00:00',   //初始播放时间
      showTime2: '00:00',
      audioTime: 0,         //音频的总时间
      audioPauseIcon: 'https://hologic.arcdmi.com/api/Images/playIcon2.png',  //按钮
      audioPlayIcon: 'https://hologic.arcdmi.com/api/Images/pauseIcon.png',
      show: true,
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
    this.innerAudioContext = wx.createInnerAudioContext()
    this.query = wx.createSelectorQuery().in(this)
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
        console.log(that.innerAudioContext.currentTime);
        let _currentTime = that.innerAudioContext.currentTime
        let min = (parseInt(_currentTime / 60) < that.data.fixValue) ? '0' + parseInt(_currentTime / 60) : parseInt(_currentTime / 60)
        let sec = (parseInt(_currentTime % 60) < that.data.fixValue) ? '0' + parseInt(_currentTime % 60) : parseInt(_currentTime % 60)
        // 如果 当前时间大于总时间 ？
        
        that.setData({
          'customAudio.currentTime': _currentTime,
          'customAudio.currentTimePase': `${min}:${sec}`
        });
      })
      // 监听音频播放结束事件
      that.innerAudioContext.onEnded(() => {
        // 
        that.setData({
          'customAudio.isPlayAudio': false,
          'customAudio.audioTime': 0,
          'customAudio.showTime1': `00:00`,
        })
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
      let that = this
      let _init = true
      let _startX = e.touches[0].pageX
      this.query.select('#progressted').boundingClientRect(function(res){
        this._queueCb=[];
        let _left = res.left
        that.setData({
          'touch.init': _init,
          'touch.startX': _startX,
          'touch.left': _left,
        })
      }).exec()
    },
    _progressMove(e){
      console.log(e);
      if (!this.data.touch.init) return
      const moveDistance = e.touches[0].pageX - this.data.touch.startX   // 移动的偏移量
      //const offsetWidth = Math.min(Math.max(0, moveDistance + this.data.touch.left), this.$refs.progressBar.clientWidth)
     

    },
    _progressEnd(){

    }
  },
  observers: {
  }
})



/*
1、制作不可快进的简单音频组件
  >1.得到外部传入的 url, 获取该音频的 总时长 duration

*/

/*
问题：
  1、进度更新的当前时间大于总时间
  2、播放结束根据是否自动播放、循环播放重置状态表
  3、加载中事件的处理
  4、使用字体文件图标，如何传入
 */