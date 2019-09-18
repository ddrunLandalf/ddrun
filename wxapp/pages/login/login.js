const app = getApp();
let _this ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{
      phone_number: '',
      code: ''
    },
    second: 60,
    notbind: false
  },
  //输入
  bindInput(e){
    let name = e.currentTarget.dataset.name;
    this.data.formData[name] = e.detail.value
    this.setData({
      formData: this.data.formData
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
  },
  //获取验证码
  getCode() {
    if (this.data.formData.phone_number == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '获取中',
        mask: true
      })
      app.com.post('wx/user/code', {
        phone_number: this.data.formData.phone_number
      }, function (res) {
        wx.hideLoading()
        if (res.errno === 0) {
          _this.setData({
            second: 60,
            notbind: true
          })
          let d = setInterval(function () {
            if (_this.data.second > 0) {
              _this.setData({
                second: _this.data.second - 1
              })
            } else {
              _this.setData({
                second: 60,
                notbind: false
              })
              clearInterval(d)
            }
          }, 1000)
        }
      })
    }
  },
  /**
   * 提交
   */
  submit(e){
    let user = e.detail.rawData;
    if(this.data.formData.phone_number.length != 11){
      wx.showToast({
        title: '请输入11位手机号',
        icon: 'none'
      })
    } else if (this.data.formData.code == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }else{
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      
      app.com.post('wx/user/bindPhone',{
        phone_number:this.data.formData.phone_number,
        code: this.data.formData.code,
        user: user,
        superior_id: wx.getStorageSync("superior_id") || ""
      },function(res){
        wx.hideLoading();
        if(res.errno == 0){
          wx.showToast({
            title: '登录成功',
            duration:1000,
            mask:true
          })
          wx.setStorage({
            key: 'phone',
            data: _this.data.formData.phone_number,
            success(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }
          })
        }
      })
    }

  },

  //获取微信手机号
  getWxphone(e){
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    if (e.detail.encryptedData){
      app.com.post('wx/user/getwxPhone',{
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        superior_id: wx.getStorageSync("superior_id") || ""
      },function(res){
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: '登录成功',
            duration: 1000,
            mask: true
          })
          wx.setStorage({
            key: 'phone',
            data: res.data.phone,
            success() {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      })
    }
  }
})