const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_name: '',
    realname: '',
    account_number: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
      url: options.url,
    })
    if(options.url == 'update'){
      let update = JSON.parse(options.data);
      _this.setData({
        url: options.url,
        account_name: update.account_name,
        realname: update.realname,
        account_number: update.account_number,
        id: update.id
      })
    }
  },

  accountInput(e){
    this.setData({
      account_name: e.detail.value
    })
  },

  rnInput(e){
    this.setData({
      realname: e.detail.value
    })
  },

  anInput(e){
    this.setData({
      account_number: e.detail.value
    })
  },

  submit(){
    if (this.data.account_name == ''){
      wx.showToast({
        title: '请输入开户行',
        icon : 'none'
      })
    } else if (this.data.realname == ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    } else if (this.data.account_number == '') {
      wx.showToast({
        title: '请输入卡号',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '保存中请稍等',
        mask: true
      })
      app.com.post('wx/account/'+this.data.url,{
        account_name: this.data.account_name,
        realname: this.data.realname,
        account_number: this.data.account_number,
        id: this.data.id || ''
      },function(res){
        wx.hideLoading()
        if(res.errno === 0){
          wx.showToast({
            title: '保存成功',
            duration: 1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      }) 
    }
  }
})