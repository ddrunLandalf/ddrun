const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: [{ label: '关闭接单', value: 0 }, { label: '手动接单', value: 1 }, { label: '自动接单', value: 2 }],
    modeFlag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
      modeFlag: options.mode
    })
  },
  modeChange(e){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.com.post('wx/service/mode',{
      mode: this.data.mode[e.detail.value].value
    },function(res){
      wx.hideLoading()
      if(res.errno === 0){
        wx.showToast({
          title: res.errmsg,
        })
        _this.setData({
          modeFlag: e.detail.value
        })
      }
    })
  }
  
})