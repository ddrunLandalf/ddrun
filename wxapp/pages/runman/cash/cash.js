const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFee: '0.00',
    realFee: 0,
    cashFee: null,
    type: 1, //1.用户 2.跑男 3.代理
    typeFilter:'user'
  },
  cashInput(e) {

    this.setData({
      cashFee: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    let typeFilter = '';
    if(options.type == 1){
      typeFilter = 'user';
    }else if(options.type == 2){
      typeFilter = 'run';
    }else{
      typeFilter = 'agent';
    }
    _this.setData({
      type: options.type,
      typeFilter: typeFilter
    })
    this.getData()
  },
  getData() {
    let url = 'amountUser';
    if (this.data.type == 1) {
      url = 'amountUser';
    } else if (this.data.type == 2) {
      url = 'amountRun'
    } else if (this.data.type == 3) {
      url = 'amountAgent'
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.com.post('wx/cash/' + url, {
    }, function (res) {
      wx.hideLoading();
      if (res.errno === 0) {
        _this.setData({
          showFee: res.data.surplus_amount.toFixed(2),
          realFee: res.data.surplus_amount,
          cashConfig: res.data.cashConfig
        })
      }
    })
  },
  cashAll() {
    if (this.data.realFee > this.data.cashConfig[this.data.typeFilter + '_min_cash']) {
      this.setData({
        cashFee: this.data.realFee.toFixed(2)
      })
    } else {
      wx.showToast({
        title: '单笔提现金额不能小于' + this.data.cashConfig[this.data.typeFilter + '_min_cash']+'元',
        icon: 'none'
      })
    }
  },
  cashIt() {
    if (parseFloat(this.data.cashFee) <= parseFloat(this.data.cashConfig[this.data.typeFilter + '_min_cash'])) {
      wx.showToast({
        title: '单笔提现金额不能小于' + this.data.cashConfig[this.data.typeFilter + '_min_cash']+'元',
        icon: 'none'
      })
    } else if (parseFloat(this.data.cashFee) > parseFloat(this.data.cashConfig[this.data.typeFilter + '_max_cash'])) {
      wx.showToast({
        title: '单笔提现金额不能大于' + this.data.cashConfig[this.data.typeFilter + '_max_cash']+'元',
        icon: 'none'
      })
    } else if (this.data.cashFee > this.data.realFee + 0.01) {
      wx.showToast({
        title: '提现金额不能大于余额',
        icon: 'none'
      })
      this.setData({
        cashFee: this.data.realFee.toFixed(2)
      })
    } else if (!this.data.bankCard){
      wx.showToast({
        title: '请选择一张银行卡',
        icon: 'none'
      })
    }else {
      wx.showLoading({
        title: '请求中',
        task: true
      })
      app.com.post('wx/cash/' + this.data.typeFilter, { 
        cashFee: this.data.cashFee ,
        account_id: this.data.bankCard.id
      }, function (res) {
        if (res.errno === 0) {
          wx.hideLoading()
          
          wx.showToast({
            title: res.errmsg,
            duration: 1000,
            mask: true
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/runman/cash/recode/recode?type='+this.data.type,
            })
          },1000)
        }
      })
    }
  }
})