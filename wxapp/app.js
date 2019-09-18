const util = require('./utils/util.js')
App({
  com:util,
  //authority/list
  onLaunch: function () {
    // if(!wx.getStorageSync("token")){
    //   util.login(function(){ })
    // }
    util.post('wx/config/wxapp', {}, function (res) {
      if(res.errno === 0){
        wx.setStorageSync("wxapp", res.data)
        wx.setNavigationBarTitle({
          title: res.data.navbarTitle,
        })
        wx.setNavigationBarColor({
          frontColor: res.data.navbarFrontColor,
          backgroundColor: res.data.navbarBackColor,
        })
      }
    })
  },
  globalData: {
    userInfo: null
  },
  isPhoneExist(nav){
    if(wx.getStorageSync("phone")){
      return true
    }else {
      if (nav == 'redirectTo'){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '您还没有登录，是否前往登录',
          confirmText: '前往登录',
          cancelText: '我再看看',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
      
    }
  }
})