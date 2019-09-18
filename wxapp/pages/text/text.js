const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      url:options.url
    })
    this.getConfig()
  },
  getConfig(){
    app.com.post('wx/config/text',{
      name:this.data.url
    },function(res){
      if(res.errno === 0){
        _this.setData({
          htmlData: res.data
        })
      }
    })
  }
  
})