const cityData = require('../../../utils/city.js');
const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letters:['#','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'],
    lettersFlag:0,
    cityData: cityData.cityData,
    scrollIntoView:'',
    showLetter:false,
    hotCity:[{name:'杭州市'},{name:'湖州市'},{name:'绍兴市'},{name:'宁波市'}]
  },
  /**
   * 点击滑动到字母
   */
  clickIntoView: function (e) {
    let index = e.currentTarget.dataset.index;
    _this.setData({
      scrollIntoView: index == 0 ? 'top':_this.data.letters[index],
      lettersFlag:index,
      showLetter:true
    })
    setTimeout(function(){
      _this.setData({
        showLetter: false
      })
    },800)
  },
  /**
   * 移动到字母
   */
  moveIntoView: function (e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    _this.setData({
      location: wx.getStorageSync("getLocation")
    })
  },
  /**
   * 选中城市
   */
  chooseCity: function (e) {
    let name = e.currentTarget.dataset.name;
    let pages = getCurrentPages();
    let prePage = getCurrentPages()[pages.length - 2];
    prePage.setData({
      cityName: name
    })
    wx.setStorageSync("city_name", name);
    wx.navigateBack({
      delta:1
    })
  }
})