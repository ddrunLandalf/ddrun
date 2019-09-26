const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname:'',
    id_number:'',
    card_z_img:'',
    card_f_img:'',
    is_watch: false,
    formId:'',
    url:app.com.API
  },
  realnameInput(e){
    this.setData({
      realname:e.detail.value
    })
  },
  numberInput(e) {
    this.setData({
      id_number: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this= this;
    if(options.data){
      let dat = JSON.parse(options.data);
      this.setData({
        realname: dat.realname,
        id_number: dat.id_number,
        card_z_img: dat.card_z_img,
        card_f_img: dat.card_f_img,
        id: dat.id
      })
    }
  },
  //上传图片
  uploadImg(e){
    if (e.detail.formId) {
      this.setData({
        'formId': e.detail.formId
      })
    }
    console.log(e)
    let type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count:1,
      success: function(res) {
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        wx.uploadFile({
          url: app.com.API + 'wx/file/uploadCard',
          filePath: res.tempFilePaths[0],
          name: 'image',
          header:{
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync("token")
          },
          success(res){
            wx.hideLoading()
            res = JSON.parse(res.data)
            if(res.errno === 0) {
              if(type == 2){
                _this.setData({
                  card_f_img: res.data.url,
                })
              }else{
                _this.setData({
                  card_z_img: res.data.url,
                })
              }
            }
          }
        })
      },
    })
    
  },
  checkboxChange(e){
      this.setData({
        is_watch: e.detail.value.length == 1 ? true:false
      })
  },
  nextform(e) {
    this.setData({
      'formId': e.detail.formId
    })
  },
  submit(){
    if(this.data.realname == ''){
      wx.showToast({
        title: '请填写真实姓名',
        icon:'none'
      })
    } else if (this.data.id_number.length != 18){
      wx.showToast({
        title: '请填写18位身份证号码',
        icon: 'none'
      })
    } else if (this.data.card_z_img == ''){
      wx.showToast({
        title: '请上传身份证正面',
        icon: 'none'
      })
    } else if (this.data.card_z_img == '') {
      wx.showToast({
        title: '请上传身份证反面',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '提交中',
        mask:true
      })
      let url = 'register';
      if(this.data.id){
        url = 'update'
      }
      app.com.post('wx/service/'+url,{
        realname: this.data.realname,
        id_number: this.data.id_number,
        card_z_img: this.data.card_z_img,
        card_f_img: this.data.card_f_img,
        formId: this.data.formId,
      },function(res){
        wx.hideLoading()
        if(res.errno === 0){
            wx.showToast({
              title: res.errmsg,
              duration: 1000
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '/pages/runman/verify/verify',
              })
            },1000)
        }
      })
    }
  }
})