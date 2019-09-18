const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },
  openlocation(e){
    let type = e.currentTarget.dataset.type
    wx.openLocation({
      latitude: type == 1 ? this.data.order.start_address.latitude : this.data.order.end_address.latitude,
      longitude: type == 1 ? this.data.order.start_address.longitude : this.data.order.end_address.longitude,
      name: type == 1 ? this.data.order.start_address.formatted_addresse : this.data.order.end_address.formatted_addresse
    })
  },
  makePhoneCall2(e){
    let type = e.currentTarget.dataset.type;
    wx.makePhoneCall({
      phoneNumber: type == 1 ? this.data.order.start_address.phone : this.data.order.end_address.phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    _this.setData({
      order_no: options.order_no
    })
  },
  onShow() {
    _this.getOrder(this.data.order_no)
  },
  getOrder(order_no) {
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/order/find', {
      order_no: order_no
    }, function (res) {
      wx.hideLoading()
      if (res.errno === 0) {
        if (res.data.start_address != 'nearby') {
          res.data.start_address = JSON.parse(res.data.start_address);
        }
        res.data.end_address = JSON.parse(res.data.end_address);
        res.data.filterDistance = (res.data.distance / 1000).toFixed(2);
        _this.setData({
          order: res.data
        })
        if (res.data.ws_id != 0) {
          _this.getService(res.data.ws_id)
        }
      }
    })
  },

  //打电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },

  //取消订单
  cancelOrder() {
    wx.navigateTo({
      url: "/pages/order/cancel/cancel?order_id=" + this.data.order.id + "&order_no=" + this.data.order.order_no + "&type=2",
    })
  },

  getService(ws_id) {
    app.com.post('wx/service/orderfind', {
      ws_id: ws_id
    }, function (res) {
      if (res.errno === 0) {
        _this.setData(res.data)
      }
    })
  }
})