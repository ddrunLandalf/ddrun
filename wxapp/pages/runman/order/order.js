const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: ["待配送", "配送中","历史订单"],
    tagFlag: 0,
    pageSize:10,
    currentPage:1,
    list:[],
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    this.getList(0)
  },

  //改变标签
  changeTag(e){
    _this.setData({
      tagFlag: e.currentTarget.dataset.index
    })
    _this.getList(0)
  },
  //获取列表
  getList(e){
    if(e == 0){
      this.data.currentPage = 1
    }else{
      this.data.currentPage += 1
    }
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/order/takelist',{
      pageSize: this.data.pageSize,
      currentPage: this.data.currentPage,
      tagFlag: this.data.tagFlag
    },function(res){
      wx.stopPullDownRefresh()
      wx.hideLoading()
      for (let i in res.data.data){
        if (res.data.data[i].start_address != 'nearby'){
          res.data.data[i].start_address = JSON.parse(res.data.data[i].start_address);
        }
        res.data.data[i].end_address = JSON.parse(res.data.data[i].end_address);
        res.data.data[i].filterDistance = res.data.data[i].distance > 999 ? (res.data.data[i].distance / 1000).toFixed(1) + '公里' : res.data.data[i].distance + '米'
      }
      if(res.errno === 0){
        _this.setData({
          list: res.data.data,
          total: res.data.count
        })
      }
    })
  },

  onPullDownRefresh(){
    this.getList(0)
  },
  onReachBottom(){
    if(this.data.list.length < this.data.total){
      this.getList(1)
    }
  },

  //订单接手
  receive(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '提示',
      content: '请确认接单',
      cancelText:'点错手误',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '加载中',
          })
          app.com.post('wx/order/receive',{
            order_id: order_id,
          },function(res){
            wx.hideLoading()
            if(res.errno === 0){
              wx.showToast({
                title: res.errmsg,
              })
              _this.getList(0)
            }
          })
        }
      }
    })
  },
  //确认送达
  confirmSend(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '提示',
      content: '请确认是否到达制定地点，若用户检举，将会受到处罚',
      cancelText: '点错手误',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          app.com.post('wx/order/confirmSend', {
            order_id: order_id,
          }, function (res) {
            wx.hideLoading()
            if (res.errno === 0) {
              wx.showToast({
                title: res.errmsg,
              })
              _this.getList(0)
            }
          })
        }
      }
    })
  },
  //确认完成
  confirmRun(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.showModal({
      title: '提示',
      content: '请尽量让用户确认完成，避免不必要的纠纷',
      cancelText: '点错手误',
      confirmText:'任要确认',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          app.com.post('wx/orderConfirm/run', {
            order_id: order_id,
          }, function (res) {
            wx.hideLoading()
            if (res.errno === 0) {
              wx.showToast({
                title: res.errmsg,
              })
              _this.getList(0)
            }
          })
        }
      }
    })
  },

  cancelOrder(e){

  }
})