const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    eva:{},
    score:0,
    text:'',
    textarea:""
  },
  textareaInput(e){
    this.setData({
      textarea: e.detail.value
    })
  },
  //点击星星
  clickStar(e){
    let score = e.currentTarget.dataset.index + 1;
    let text = '';
    if(score == 1){
      text = '非常不满意，各方面都很差';
    }else if(score == 2) {
      text = '不满意，比较差';
    } else if (score == 3) {
      text = '一般，需要改善';
    } else if (score == 4) {
      text = '比较满意，但仍可改善';
    } else{
      text = '非常满意无可挑剔';
    }
    _this.setData({
      score: score,
      text: text
    })
  },
  getEva(id){
    app.com.post('wx/evaluate/find',{
      order_id: id
    },function(res){
      if(res.errno === 0){
        _this.setData({
          eva: res.data
        })
      }
    })
  },
  //评价
  submitEva(){
    if (this.data.score == 0){
      wx.showToast({
        title: '请点击小星星',
        icon: 'none'
      })
    }else if(!this.data.order.ws_id){
      wx.showToast({
        title: '该订单还没有被接单',
        icon: 'none'
      })
    }else{
      wx.showLoading({
        title: '提交中',
        mask:true
      })
      app.com.post('wx/evaluate/add',{
        score: this.data.score,
        order_id: this.data.order.id,
        msg: this.data.textarea,
        ws_id: this.data.order.ws_id
      },function(res){
        if(res.errno === 0){
          wx.showToast({
            title: res.errmsg,
          })
          _this.getEva(_this.data.order.id)
        }
      })
    }
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
  getOrder(order_no){
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/order/find',{
      order_no: order_no
    },function(res){
      wx.hideLoading()
      if(res.errno === 0){
        if (res.data.start_address != 'nearby'){
          res.data.start_address = JSON.parse(res.data.start_address);
        }
        if(!res.data.end_address.id){
          res.data.end_address = JSON.parse(res.data.end_address);
        }
        res.data.filterDistance = (res.data.distance / 1000).toFixed(2);
        _this.setData({
          order: res.data
        })
        if (res.data.ws_id != 0){
          _this.getService(res.data.ws_id)
        }
        _this.getEva(res.data.id)
      }
    })
  },

  //打电话
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },

  //取消订单
  cancelOrder(){
    wx.navigateTo({
      url: "/pages/order/cancel/cancel?order_id=" + this.data.order.id + "&order_no=" + this.data.order.order_no+"&type=1",
    })
  },

  getService(ws_id){
    app.com.post('wx/service/orderfind',{
      ws_id: ws_id
    },function(res){
      if(res.errno === 0){
        _this.setData(res.data)
      }
    })
  }
})