const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.getVerify()
  },
  update(){
    wx.redirectTo({
      url: '/pages/runman/register/register?data='+JSON.stringify(this.data.msg),
    })
  },
  getVerify() {
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/service/find', {}, function (res) {
      wx.hideLoading()
      if (res.errno === 0) {
        _this.setData({
          msg: res.data
        })
        if (res.data.status == 1 && res.data.verify.status == 2) {
          wx.redirectTo({
            url: '/pages/runman/index',
          })
        }
      }
    })
  }
})