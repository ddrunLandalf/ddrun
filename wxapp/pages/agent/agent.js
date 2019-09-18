const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {},
    navigator: [
      { icon: '/img/order.png', label: '提现', url: '/pages/runman/cash/cash?type=3' },
      { icon: '/img/order.png', label: '提现记录', url: '/pages/runman/cash/recode/recode?type=3' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.getAgent();
    _this.getAnlysis()
  },

  
  //获取数据
  getAgent() {
    app.com.post('wx/agent/info', {}, function (res) {
      if (res.errno === 0) {
        _this.setData({
          agent: res.data
        })
      }
    })
  },

  getAnlysis(){
    app.com.post('wx/agent/anlysis', {}, function (res) {
      if (res.errno === 0) {
        _this.setData(res.data)
      }
    })
  },
  //切换版本
  changePage() {
    wx.showModal({
      title: '提示',
      content: '您确定要切换版本吗？',
      success(res) {
        if (res.confirm) {
          wx.setStorageSync('page', '/pages/index/index');
          wx.navigateBack({
            delta: 1,
            success() {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }
          })
        }
      }
    })
  }
})