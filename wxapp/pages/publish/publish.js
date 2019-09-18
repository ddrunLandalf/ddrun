const app = getApp ();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calculation:{
      coupon:[]
    },
    couponFlag:0,
    totalPrice:0,
    interalCheck:false,
    litFee: [{ label: '没有小费', value: 0 },{ label: '1元', value: 1 }, { label: '2元', value: 2 }, { label: '4元', value: 4 }, { label: '6元', value: 6 }, { label: '8元', value: 8 }, { label: '10元', value: 10 }],
    litFeeFlag:0,
    times: app.com.getTimeOptions(),
    timeFlag: 0,
    showDetail:false,
  },
  //改变时间选项
  timeChange(e){
    this.setData({
      timeFlag: e.detail.value
    })
    _this.reSumPrice()
  },
  feeDetail(){
    this.setData({
      showDetail: !this.data.showDetail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData(JSON.parse(options.data))
    _this.sumPrice()
  },
  //选择优惠券
  changeCoupon(e){
    this.setData({
      couponFlag:e.detail.value,
      interalCheck: false
    })
    this.reSumPrice()
  },

  //重新计算价格
  reSumPrice(){
    let totalPrice = parseFloat(this.data.calculation.totalPrice);
    if(this.data.couponFlag > 0){
      totalPrice = totalPrice - parseFloat(this.data.calculation.coupon[this.data.couponFlag].coupon.discount_amount);
    }
    if (this.data.interalCheck){
      totalPrice = totalPrice - parseFloat(this.data.calculation.interal.exchange)
    }
    totalPrice = totalPrice + parseFloat(this.data.litFee[this.data.litFeeFlag].value);

    //午夜
    let temp = -1;
    let send_time;
    if (this.data.calculation.timeOption.open_night == 1) {
      let h ;
      if(this.data.timeFlag == 0){
        h = new Date().getHours();
        send_time = app.com.dateFormat(0, -1, 'yyyy-MM-dd hh:mm:ss');
      }else{
        h = this.data.times[this.data.timeFlag].value
        if (this.data.times[this.data.timeFlag].label.indexOf('明天')){
          send_time = app.com.dateFormat(1, h, 'yyyy-MM-dd hh:mm:ss');
        }else{
          send_time = app.com.dateFormat(0, h, 'yyyy-MM-dd hh:mm:ss');
        }
      }
      for (let i in this.data.calculation.timeOption.nightOptons) {
        if (this.data.calculation.timeOption.nightOptons[i] == h) {
          temp = i
        }
      }
      
      if (temp != -1) {
        totalPrice = totalPrice + parseFloat(this.data.calculation.timeOption.nightPrice);
      }
    }
    this.setData({
      send_time: send_time,
      totalPrice: totalPrice.toFixed(2),
      nightPrice: temp != -1 ? this.data.calculation.timeOption.nightPrice:0
    })
  },

  //计算价格
  sumPrice(){
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/cost/calculation',{
      startAddress: JSON.stringify(this.data.startAddress),
      endAddress: JSON.stringify(this.data.endAddress),
      weight_id: this.data.title == '代驾' ? 0:this.data.weight.id,
      service_type: this.data.title
    },function(res){
      wx.hideLoading();
      if(res.errno === 0){
        _this.setData({
          calculation: res.data,
          totalPrice: res.data.totalPrice,
        })
        _this.reSumPrice()
      }
    })
  },
  //选择积分抵扣
  clickBox(e){
    if(e.detail.value.length > 0){
      this.setData({
        interalCheck: true,
        couponFlag:0
      })
    }else{
      this.setData({
        interalCheck: false,
      })
    }
    this.reSumPrice()
  },

  //选择小费
  feeChange(e){
    this.setData({
      litFeeFlag: e.detail.value
    })
    this.reSumPrice()
  },

  //发起支付请求
  doPay(){
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('wx/order/pay',{
      startAddress: JSON.stringify(this.data.startAddress),
      endAddress: JSON.stringify(this.data.endAddress),
      weight_id: this.data.title == '代驾' ? 0:this.data.weight.id,
      service_type: this.data.title,
      timeValue: this.data.times[this.data.timeFlag].value,
      couponId: this.data.couponFlag > 0 ? this.data.calculation.coupon[this.data.couponFlag].id:0,
      useInteral: this.data.interalCheck ? 1:0,
      textarea: this.data.textarea || '代驾',
      send_time: this.data.send_time,
      form_ids: this.data.formId.toString(),
      tip: this.data.litFee[this.data.litFeeFlag].value,
    },function(res){
      wx.hideLoading()
      if(res.errno === 0){
        wx.requestPayment({
          timeStamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success(re){
            wx.showToast({
              title: '下单成功',
              duration: 1000,
              mask: true
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '/pages/order/detail/detail?order_no=' + res.data.out_trade_no,
              })
            },1000)
          },
          fail(re){
            wx.showLoading({
              title: '取消支付中',
              mask: true
            })
            app.com.post('wx/orderCancel/close',{
              order_no: res.data.out_trade_no
            },function(res){
              wx.hideLoading()
              if(res.errno === 0){
                wx.showToast({
                  title: res.errmsg,
                })
              }
            })
          }
        })
      }
    })
  },
  desform(e) {
    this.setData({
      'formId[3]': e.detail.formId
    })
  },

})