const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone_number: '',
    second:60,
    notbind: false,
    code:''
  },
  phoneInput(e){
    this.setData({
      phone_number:e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码
  getCode(){
    if(this.data.phone_number == ''){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '获取中',
        mask: true
      })
      app.com.post('wx/user/code',{
        phone_number: this.data.phone_number
      },function(res){
        wx.hideLoading()
        if(res.errno === 0){
          _this.setData({
            second: 60,
            notbind: true
          })
          let d = setInterval(function(){
            if (_this.data.second > 0){
              _this.setData({
                second: _this.data.second - 1
              })
            }else{
              _this.setData({
                second: 60,
                notbind: false
              })
              clearInterval(d)
            }
          },1000)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this= this
  },
  /**
    * 提交
    */
  submit(e) {
    let user = e.detail.rawData;
    if (this.data.phone_number.length != 11) {
      wx.showToast({
        title: '请输入11位手机号',
        icon: 'none'
      })
    } else if (this.data.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍等',
        mask: true
      })
      app.com.post('wx/user/bindPhone', {
        phone_number: this.data.phone_number,
        code: this.data.code,
        user: user
      }, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: '更换成功',
            duration: 1000,
            mask: true
          })
          wx.setStorage({
            key: 'phone',
            data: _this.data.phone_number,
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

  },
})