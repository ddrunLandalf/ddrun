const app = getApp();
const parseAddress = require('../../../utils/address-parse.js')
let _this = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    textarea:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.initLoad(options)
  },
  //黏贴输入
  smartInput(e){
    this.setData({
      textarea:e.detail.value
    })
  },
  //智能识别
  doParse(){
    let add = parseAddress(this.data.textarea)
    console.log(add)
    wx.showLoading({
      title: '解析中',
      mask:true
    })
    app.com.post('wx/location/parse',{
      address: add.city + add.area + add.addr
    },function(res){
      wx.hideLoading()
      if(res.errno === 0){
        _this.setData({
          'address.latitude':res.data.location.lat,
          'address.longitude': res.data.location.lng,
          'address.street_number': res.data.address_components.street_number,
          'address.formatted_addresse': add.addr,
          'address.province': add.province,
          'address.city': add.city,
          'address.district': add.area,
          'address.phone': add.mobile,
          'address.name': add.name,
        })
      }
    })
  },
  /**
   * 初始化页面
   */
  initLoad: function (e) {
    _this.setData({
      type: e.type,
      text: e.text,
      address: e.address ? JSON.parse(e.address):{},
      address_default: e.address_default || null,
      page:e.page || null //上级页面的名称
    })
    wx.setNavigationBarTitle({
      title: e.text + '地址',
    })
  },

  //输入
  bindInput(e){
    let address = this.data.address;
    address[e.currentTarget.dataset.name] = e.detail.value;
    this.setData({
      address: address
    })
  },

  /**
   * 保存提交
   */
  submit(){
    if(!this.data.address.latitude){
      wx.showToast({
        title: '请选择一个地址',
        icon: 'none'
      })
    } else if (!this.data.address.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else {
      let url = 'add';
      if (this.data.address.id){
        url = 'update';
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      if(this.data.address_default){
        this.data.address.address_default = this.data.address_default
      }
      app.com.post('wx/address/' + url, this.data.address, function(res){
        wx.hideLoading()
        if(res.errno === 0){
          wx.showToast({
            title: res.errmsg,
            mask: true,
            duration: 1000
          })
          _this.data.address.id = res.data.id;
          let pages = getCurrentPages();
          let delta = 1;
          if (_this.data.page == 'address') {
            delta = 2
          }
          let prePage = getCurrentPages()[pages.length - delta-1];
          if (_this.data.address_default){
            prePage.getHomeAndCompany()
          } else if(_this.data.type == 'start'){
            prePage.setData({
              startAddress: _this.data.address
            })
          }else{
            prePage.setData({
              endAddress: _this.data.address
            })
          }
          
          setTimeout(function(){

            wx.navigateBack({
              delta: delta
            })
          },1000)
        }
      })
    }
  }

})