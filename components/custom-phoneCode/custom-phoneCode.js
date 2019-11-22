const phoneReg = /^1\d{10}$/;
Component({
  behaviors: [],   // 组件间的共享 类似于 mixins
  properties: {
    audioName: {  // 音频的名称
      type: String,
      value: '',
      observer: function _observerTitle(newVal, oldVal) { }
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
    
    
    
    
    
    
  },
  data: {
    form:{
      phone:'',
      code:''
    },
    code: {
      countDown: '获取验证码',
      countDownStatus: true,
      countDownTime: 60,
    },
  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () {
     
    },
  },
  created() {
    console.log('组件实例化');
    
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  methods: {
    _Init() {
      let that = this;
    },
    bindInput(e){
      let value = e.detail.value
      let type = e.target.dataset.type
      let key = 'form.' + type
      this.setData({
        [key]: value
      })
      console.log(this.data);
    },
    sendPhoneCode() {
      let phone = this.data.form.phone;
      if (!phone){
        wx.showModal({
          title: '提示',
          content: '请输入手机号！',
          showCancel: false,
          success: function (res) { }
        })
        return
      } 

      if (!(phoneReg.test(phone))){
        wx.showModal({
          title: '提示',
          content: '手机号码格式不正确！',
          showCancel: false,
          success: function (res) { }
        })
        return
      } 

      // 请求后台返回验证码



      



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