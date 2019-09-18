const app = getApp();
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
    if(options.cash){
      this.setData({
        cash: options.cash
      })
    }
  },
  onShow(){
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
    app.com.post('wx/account/list', {
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
  update(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/runman/cash/banks/edit?url=update&data=' + JSON.stringify(this.data.list[index]),
    })
  },
  del(e){
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '删除后数据无法恢复，是否要继续删除？',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
            mask: true
          })
          app.com.post('wx/account/recover', { id: _this.data.list[index].id},function(res){
            wx.hideLoading()
            if(res.errno === 0){
              wx.showToast({
                title: '删除成功',
              })
              _this.getList(0)
            }
          })
        }
      }
    })
  },
  //选择
  chooseIt(e){
    let index = e.currentTarget.dataset.index;
    if(this.data.cash){
      let pages = getCurrentPages();
      let prePage = getCurrentPages()[pages.length - 2];
      prePage.setData({
        bankCard: this.data.list[index]
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
  
})