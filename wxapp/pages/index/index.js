//index.js

const app = getApp()
let _this;
Page({
  data: {
    //我的位置
    myLocation:{
      latitude: 23.099994,
      longitude: 113.324520
    },
    serviceOptionsFlag:0,
    serviceOptions:[
      { label: '帮我送', startAddressNoticeText: '到哪里拿货', endAddressNoticeText: '送到哪里', editStartAddressTitle: '拿货', editEndAddressTitle:'收货'}, 
      { label: '帮我取', startAddressNoticeText: '到哪里取货', endAddressNoticeText: '送到哪里', editStartAddressTitle: '取货', editEndAddressTitle: '收货'}, 
      { label: '帮我买', startAddressNoticeText: '就近3公里购买', endAddressNoticeText: '送到哪里',editStartAddressTitle: '买货', editEndAddressTitle: '收货'}, 
      { label: '代驾', startAddressNoticeText: '去哪儿接驾', endAddressNoticeText: '你要去哪儿', editStartAddressTitle: '接驾', editEndAddressTitle: '终点'}
    ],
    tags:[
      "文件", "化妆品", "家具", "宠物", "蛋糕", "鲜花", "海鲜","易碎物品","保鲜"
    ],
    weights:[],
    weightsFlag:-1,
    weightsTitle:'选择重量范围',
    //始发地址
    startAddress:{ },
    //结束地址
    endAddress:{ },
    tagBuyFlag: 1, //帮我买的方式  0 指定地点购买 1  就近3公里购买
    textarea:'',
    coupon_show:false,
    showCoupon:{},
    formId:["","","",""]
  },
  
  onLoad: function (options) {
    _this = this;
    _this.getServiceStatus();
    if(options.wx_id){
      wx.setStorageSync("superior_id", options.wx_id)
    }
  },
  
  onShow(){
  },
  closeCoupon(){
    _this.setData({
      coupon_show: false
    })
  },
 
  /**
   * 下一步
   */
  nextStep: function () {
    if (app.isPhoneExist()){
        if (!this.data.startAddress.city && this.data.serviceOptions[this.data.serviceOptionsFlag].startAddressNoticeText.indexOf('就近') == -1){
          wx.showToast({
            title: '请选择地址',
            icon:'none'
          })
        } else if (!this.data.endAddress.city ){
          wx.showToast({
            title: '请选择地址',
            icon: 'none'
          })
        } else if (this.data.weightsFlag == -1 && this.data.serviceOptionsFlag != 3){
          wx.showToast({
            title: '请选择物品重量',
            icon: 'none'
          })
        } else if (this.data.textarea == '' && this.data.serviceOptionsFlag != 3){
          wx.showToast({
            title: '请输入物品内容',
            icon: 'none'
          })
        }else {

          wx.navigateTo({
            url: '/pages/publish/publish?data='+JSON.stringify({
              startAddress: this.data.serviceOptions[this.data.serviceOptionsFlag].startAddressNoticeText.indexOf('就近') > -1 ? 'nearby':this.data.startAddress,
              endAddress: this.data.endAddress,
              textarea:this.data.textarea,
              weight: this.data.weights[this.data.weightsFlag],
              title: this.data.serviceOptions[this.data.serviceOptionsFlag].label,
              formId: this.data.formId
            }),
          })
      }
    }
  },
  /**
   * 获取地址，跳转地址页
   */
  getAddress: function (e) {
    if (app.isPhoneExist()){
      let type = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '/pages/address/supply/supply?type='+type+'&text='
          + (type == 'start' ? _this.data.serviceOptions[_this.data.serviceOptionsFlag].editStartAddressTitle : _this.data.serviceOptions[_this.data.serviceOptionsFlag].editEndAddressTitle) + '&address=' + JSON.stringify(type == 'start' ? this.data.startAddress : this.data.endAddress),
      })
    }
  },
  /**
   * 帮我买的方式 0 指定地点购买 1  就近3公里购买
   */
  tagBuy: function (e) {
    if (app.isPhoneExist()) {
      let index = e.currentTarget.dataset.index;
      _this.setData({
        'serviceOptions[2].startAddressNoticeText': index == 0 ? '去哪儿买' :'就近3公里购买',
        tagBuyFlag: index
      })
    }
  },
  /**
   * 改变服务类型
   */
  changeService: function (e) {
    let index = e.currentTarget.dataset.index;
    _this.setData({
      serviceOptionsFlag: index,
      startAddress:{},
      endAddress:{},
      weightsFlag:-1,
      textarea:''
    })
    _this.initMyLocation()
  },
  /**
   * 选择物品重量
   */
  weightsChange: function (e) {
    _this.setData({
      weightsFlag: e.detail.value,
      weightsTitle: _this.data.weights[e.detail.value].des
    })
  },
  /**
   * 初始化我的位置
   */
  initMyLocation: function () {
    wx.getLocation({
      type:'gcj02',
      success: function(rs) {
        app.com.post('wx/location/geocoder',{location: rs.latitude+','+rs.longitude},function(res){
          if(res.errno === 0){
            wx.setStorageSync("city_name", res.data.address_component.city);
            wx.setStorageSync("getLocation", res.data.address_component.city);
            
              _this.getAgentConfig()

            if (_this.data.serviceOptionsFlag == 0 || _this.data.serviceOptionsFlag == 3){
              _this.setData({
                'startAddress.street_number': res.data.address_component.street_number,
                'startAddress.formatted_addresse': res.data.formatted_addresses.recommend,
                'startAddress.province': res.data.address_component.province,
                'startAddress.city': res.data.address_component.city,
                'startAddress.district': res.data.address_component.district,
                'startAddress.phone': wx.getStorageSync('phone'),
                'startAddress.latitude': rs.latitude,
                'startAddress.longitude': rs.longitude
              })
            }else{
              _this.setData({
                'endAddress.street_number': res.data.address_component.street_number,
                'endAddress.formatted_addresse': res.data.formatted_addresses.recommend,
                'endAddress.province': res.data.address_component.province,
                'endAddress.city': res.data.address_component.city,
                'endAddress.phone': wx.getStorageSync('phone'),
                'endAddress.district': res.data.address_component.district,
                'endAddress.latitude': rs.latitude,
                'endAddress.longitude': rs.longitude
              })
            }

          }
        })
      },
    })
  },

  /**
   * 获取服务状态
   */
  getServiceStatus(){
    wx.showLoading({
      title: '获取服务状态中',
    })
    app.com.post('wx/config/service', { },function(res){
      wx.hideLoading()
      if(res.errno == 0){
        if (JSON.parse(res.data.config_content)){
          let config = JSON.parse(res.data.config_content)
          let arr = _this.data.serviceOptions;

          arr[0].status = config.send_service;
          arr[0].time = config.init_send_time;

          arr[1].status = config.take_service;
          arr[1].time = config.init_take_time;

          arr[2].status = config.buy_service;
          arr[2].time = config.init_buy_time;

          arr[3].status = config.drive_service;
          arr[3].time = config.init_drive_time;
          
          arr[2].startAddressNoticeText = '就近' + config.buy_meter+'公里购买';
          _this.setData({
            open_agent: config.open_agent,
            serviceOptions: arr,
            serviceStatus: res.data.config_content ? JSON.parse(res.data.config_content):''
          })
         
          //获取我的位置
          _this.initMyLocation();
        }
      }
    })  
  },
 
  /**
   * 获取代理配置
   */
  getAgentConfig(){
    app.com.post('wx/agent/config',{
      city_name: this.data.open_agent == 1 ? wx.getStorageSync("city_name"):'全国'
    },function(res){
      if(res.errno === 0){
        wx.setStorageSync("agent", res.data);
        _this.initSerice(res.data)
      }
    })
  },
  //初始化服务
  initSerice(data){
    //重量选项
    for (let i in data.weight) {
      data.weight[i].des = (data.weight[i].min_weight / 1000).toFixed(0) + '~' + (data.weight[i].max_weight / 1000).toFixed(0) + 'kg'
    }

    //服务
    let service = this.data.serviceOptions;
    for (let i in data.service){
      for(let j in service){
        if (data.service[i].service_type == service[j].label){
          if (data.service[j].des_tags){
            service[j].tags = data.service[i].des_tags.split(',');
          }
          service[j].time = data.service[i].init_time;
          service[j].status = data.service[i].open_service
          if (data.service[i].service_type == '帮我买'){
            service[j].startAddressNoticeText = '就近' + data.service[i].buy_meter + '公里购买';
          }
        }
      }
    }

    _this.setData({
      weights: data.weight,
      serviceOptions: service
    })
  },

  //描述物品内容
  textInput(e){
    this.setData({
      textarea : e.detail.value
    })
  },

  //点击快捷选项
  clickTag(e){
    this.setData({
      textarea: this.data.textarea + ' '+e.currentTarget.dataset.tag
    })
  },

  //获得formId
  wsubmit(e){
    this.setData({
      'formId[0]': e.detail.formId
    })
  },
  desform(e){
    this.setData({
      'formId[1]': e.detail.formId
    })
  },
  nextform(e){
    this.setData({
      'formId[2]': e.detail.formId
    })
  },


  //转发分享
  onShareAppMessage(){
    let wxapp = wx.getStorageSync("wxapp");
    return {
      title: wxapp.shareTitle,
      path: wxapp.sharePath+ '?wx_id='+wx.getStorageSync("wx_id")
    }
  }
})