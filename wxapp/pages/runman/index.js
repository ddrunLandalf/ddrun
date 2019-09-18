const app = getApp();
let _this ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{},
    navigator: [
      { icon: '/img/order.png', label: '提现', url: '/pages/runman/cash/cash?type=2' },
      { icon: '/img/question.png', label: '跑男指南', url: "/pages/text/text?title=跑男指南&url=run_pointer" },
      { icon: '/img/runman.png', label: '跑男设置', url: '/pages/runman/status/status' },
      { icon: '/img/cphone.png', label: '跑男状态', url: '/pages/runman/verify/verify' },
      { icon: '/img/pj.png', label: '我的评价', url: '/pages/runman/evaluate/evaluate' },
      { icon: '/img/change.png', label: '切换为用户版', change: true },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.getVerify()
    _this.getAnlysis()
  },

  getVerify () {
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/service/find',{},function(res){
      wx.hideLoading()
      if(res.errno === 0){
        _this.setData({
          msg: res.data
        })
        if (!res.data.id){
          wx.redirectTo({
            url: '/pages/runman/register/register',
          })
        }
        if (res.data.status == 0 || res.data.verify.status == 1){
          wx.redirectTo({
            url: '/pages/runman/verify/verify',
          })
        }
      }
    })
  },
  //获取数据
  getAnlysis(){
    app.com.post('wx/service/anlysis',{},function(res){
      if(res.errno === 0){
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