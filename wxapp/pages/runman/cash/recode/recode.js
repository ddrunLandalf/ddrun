const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize: 10,
    list: [],
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
      this.setData({
        type: options.type
      })
  },
  onShow() {
    _this.getList(0)
  },

  //获取列表
  getList(e) {
    if (e == 0) {
      this.data.currentPage = 1
    } else {
      this.data.currentPage += 1
    }
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/cash/list', {
      user_type: this.data.type,
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage,
    }, function (res) {
      wx.stopPullDownRefresh()
      wx.hideLoading()

      if (res.errno === 0) {
        _this.setData({
          list: res.data.data,
          total: res.data.count,
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.list.length < this.data.total) {
      this.getList(1)
    }
  },
})