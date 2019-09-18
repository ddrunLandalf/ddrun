const app = getApp();
let _this = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:'杭州市',
    query:{
      keyword:'',
      pageSize:15,
      pageIndex:1
    },
    home:{},
    company:{},
    addressList:[],
    recent:[]
  },
  chooseCity: function () {
    wx.navigateTo({
      url: '/pages/address/city/city',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.initLoad(options)
    _this.getHomeAndCompany()
    _this.getRecentAddress()
  },

  /**
   * 初始化页面
   */
  initLoad: function (e) {
    _this.setData({
      type: e.type,
      text: e.text,
      page: e.page ? e.page:'',
      cityName: wx.getStorageSync("city_name")
    })
    wx.setNavigationBarTitle({
      title: e.text + '地址',
    })
  },

  //近期访问的地址
  getRecentAddress(){
    app.com.post('wx/address/recent',{},function(res){
      if(res.errno === 0){
        for(let i in res.data){
          if (res.data[i].recent_use){
            res.data[i].recent_use = app.com.formatMsgTime(new Date(res.data[i].recent_use).valueOf());
          }
          res.data[i].create_time = app.com.formatMsgTime(new Date(res.data[i].create_time).valueOf());
        }
        _this.setData({
          recent: res.data
        })
      }
    })
  },
  

  //搜索
  searchAddress(e) {
    this.setData({
      'query.keyword': e.detail.value
    })
    if (e.detail.value != ''){
      this.getAddress(0)
    }
  },
  editHome(){
    wx.navigateTo({
      url: '/pages/address/supply/supply?type='+this.data.type+'&text=家的&address_default=home_address_id&address='+JSON.stringify(this.data.home),
    })
  },
  editCompany() {
    wx.navigateTo({
      url: '/pages/address/supply/supply?type=' + this.data.type + '&text=公司的&address_default=company_address_id&address=' + JSON.stringify(this.data.company),
    })
  },
  editAddress(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/address/supply/supply?type=' + this.data.type + '&text='+this.data.text+'&page=address&address=' + JSON.stringify(this.data.company),
    })
  },
  /**
   * 获取地址列表
   */
  getAddress(type){
    if(type == 1){
      this.data.query.pageIndex += 1;
    }else{
      this.data.query.pageIndex = 1;
    }
    app.com.post('wx/location/search',{
      keyword: this.data.query.keyword,
      city_name: this.data.cityName,
      pageSize: this.data.query.pageSize,
      pageIndex: this.data.query.pageIndex
    },function(res){
      if(res.errno === 0){
        let arr = [];
        if (type == 1) {
          arr = _this.data.addressList;
          for(let i in res.data){
            arr.push(res.data[i])
          }
        } else {
          arr = res.data;
        }
        _this.setData({
          addressList: res.data
        })
      }
    })
  },

  onReachBottom(){
    if(this.data.query.keyword){
      this.getAddress(1)
    }
  },
  //选择地址
  chooseAddress(e) {
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let prePage = getCurrentPages()[pages.length - 2];
    if (this.data.page == 'supply') {
      prePage.setData({
        address: this.data.recent[index]
      })
    } else if (this.data.type == 'start') {
      prePage.setData({
        startAddress: this.data.recent[index]
      })
    } else if (this.data.type == 'end') {
      prePage.setData({
        endAddress: this.data.recent[index]
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 选中地址
   */
  takeThisAddress(e){
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let prePage = getCurrentPages()[pages.length-2];
    if(this.data.page == 'supply'){
      prePage.setData({
                        'address.id': '',
        'address.formatted_addresse': this.data.addressList[index].title,
                  'address.province': this.data.addressList[index].ad_info.province,
                      'address.city': this.data.addressList[index].ad_info.city,
                  'address.district': this.data.addressList[index].ad_info.district,
                  'address.latitude': this.data.addressList[index].location.lat,
                 'address.longitude': this.data.addressList[index].location.lng,
             'address.street_number': this.data.addressList[index].address.replace(this.data.addressList[index].ad_info.province,'').replace(this.data.addressList[index].ad_info.city,'').replace(this.data.addressList[index].ad_info.district,'') 
      })
    }
    wx.navigateBack({
      delta: 1
    })
    
  },

  /**
   * 获取家和公司地址
   */
  getHomeAndCompany(){
    app.com.post('wx/address/hc',{},function(res){
      if(res.errno === 0){
        _this.setData(res.data)
      }
    })
  },

  /**
   * 选中家地址
   */
  chooseHomeAddress(){
    if(this.data.home.city){
      let pages = getCurrentPages();
      let prePage = getCurrentPages()[pages.length - 2];
      if (this.data.page == 'supply') {
        prePage.setData({
          address: this.data.home
        })
      }else if(this.data.type == 'start'){
        prePage.setData({
          startAddress: this.data.home
        })
      } else if (this.data.type == 'end'){
        prePage.setData({
          endAddress: this.data.home
        })
      }
      wx.navigateBack({
        delta:1
      })
    }
  },
  /**
   * 选中公司地址
   */
  chooseCompanyAddress(){

    if (this.data.company.city) {
      let pages = getCurrentPages();
      let prePage = getCurrentPages()[pages.length - 2];
      if (this.data.page == 'supply') {
        prePage.setData({
          address: this.data.company
        })
      } else if (this.data.type == 'start') {
        prePage.setData({
          startAddress: this.data.company
        })
      } else if (this.data.type == 'end') {
        prePage.setData({
          endAddress: this.data.company
        })
      }
      wx.navigateBack({
        delta: 1
      })
    }
  }

  
  
})