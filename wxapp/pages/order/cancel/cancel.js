const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseFlag:-1,
    seasonInput:''
  },
  chooseReason(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      chooseFlag:index
    })
  },
  //填写理由
  inputSeason(e){
    this.setData({
      seasonInput: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    _this.setData({
      order_id: options.order_id,
      order_no:options.order_no,
      type:options.type
    })
    wx.setNavigationBarTitle({
      title: (options.type==1?'用户':'跑男')+'取消订单',
    })
    
    _this.getOrder()
  },
  //获取取消订单配置
  getSet(){
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('config/get', { config_key: "cancel_order"},function(res){
      wx.hideLoading()
      if(res.errno === 0){
        _this.setData({
          config: res.data.config_content ? JSON.parse(res.data.config_content):{},
        })
      }
    })
  },

  getOrder(){
    app.com.post('wx/order/find', { order_no: this.data.order_no }, function (res) {
      if (res.errno === 0) {
        _this.setData({
          order:res.data
        })
        _this.getOrderTimes()
      }
    })
  },

  getOrderTimes(){
    app.com.post('wx/order/findtime',{order_id:this.data.order_id},function(res){
      if (res.errno === 0) {
        _this.setData({
          ordertime: res.data
        })
        _this.getSet()
      }
    })
  },
  //发起退款
  refundIt(){
    wx.showModal({
      title: '提示',
      content: '您确定要取消吗？',
      success(res){
        if(res.confirm){
          if (_this.data.chooseFlag == -1) {
            wx.showToast({
              title: '请选择一个理由',
              icon: 'none'
            })
          } else if (_this.data.chooseFlag == -2 && _this.data.seasonInput == '') {
            wx.showToast({
              title: '请输入您的理由',
              icon: 'none'
            })
          } else {
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            let url = _this.data.type == 1 ? 'user' : 'runman';
            let seasonInput = '';
            if (_this.data.chooseFlag == -2) {
              seasonInput = _this.data.seasonInput;
            } else {
              if (_this.data.type == 1) {
                seasonInput = _this.data.config.userReasons[_this.data.chooseFlag]
              } else {
                seasonInput = _this.data.config.runmanReasons[_this.data.chooseFlag]
              }
            }
            app.com.post('wx/orderCancel/' + url, {
              order_id: _this.data.order_id,
              seasonInput: seasonInput
            }, function (res) {
              wx.hideLoading()
              if (res.errno === 0) {
                wx.showToast({
                  title: '取消成功',
                  duration: 1000,
                  mask: true
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
          }
        }
      }
    })
    
  }

})