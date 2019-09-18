const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    ing:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
   
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
    app.com.post('wx/order/list', {
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage,
      tagFlag: this.data.tagFlag
    }, function (res) {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      for (let i in res.data.data.data) {
        if(res.data.data.data[i].start_address != 'nearby'){
          res.data.data.data[i].start_address =  JSON.parse(res.data.data.data[i].start_address);
        }
        res.data.data.data[i].end_address = JSON.parse(res.data.data.data[i].end_address);
        // res.data.data.data[i].filterDistance = res.data.data.data[i].distance > 999 ? (res.data.data.data[i].distance / 1000).toFixed(1) + '公里' : res.data.data.data[i].distance + '米'
      }
      for(let i in res.data.ing){
        res.data.ing[i].start_address = JSON.parse(res.data.ing[i].start_address);
        res.data.ing[i].end_address = JSON.parse(res.data.ing[i].end_address);
      }
      if (res.errno === 0) {
        _this.setData({
          list: res.data.data.data,
          total: res.data.data.count,
          ing: res.data.ing
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.list.length < this.data.total) {
      this.getList(1)
    }
  },

})