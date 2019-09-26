const app = getApp();
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator:[
      { icon:'/img/order.png',label:'订单' ,url:'/pages/order/order',show:true},
      { icon: '/img/gift.png', label: '邀请有礼', url: "/pages/mine/retail/retail",show: false},
      { icon: '/img/question.png', label: '用户指南', url: "/pages/text/text?title=用户指南&url=user_pointer", show: true},
      { icon: '/img/runman.png', label: '成为跑男', url: '/pages/runman/register/register', show: true},
      { icon: '/img/invoice.png', label: '开票与报销', show: false },
      { icon: '/img/cphone.png', label: '变更手机号', url: '/pages/mine/changePhone/changePhone', show: true},
      { icon: '/img/change.png', label: '切换为跑男版', change: true, show: false},
      { icon: '/img/agent.png', label: '平台中心', url: '/pages/agent/agent', show: false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
  },
  onShow(){
    if (app.isPhoneExist('redirectTo')){
      this.getOwnMsg()
      
    }
  },
  //切换版本
  changePage(){
    wx.showModal({
      title: '提示',
      content: '您确定要切换版本吗？',
      success(res){
        if(res.confirm){
          wx.setStorageSync('page', '/pages/runman/order/order');
          wx.navigateBack({
            delta: 1,
            success(){
              wx.redirectTo({
                url: '/pages/runman/order/order',
              })
            }
          })
        }
      }
    })
  },
  //获取个人信息
  getOwnMsg(){
    app.com.post('wx/user/info',{},function(res){
      if(res.errno === 0){
        res.data.phone.phone_number = res.data.phone.phone_number.substring(0,3) + '****' + res.data.phone.phone_number.substring(7,11);
        _this.setData(res.data)
        let show = true;
        let url = '/pages/runman/register/register';
        let title = '成为跑男';
        let showQ = false;
        if(res.data.isRunman.id){
          show = true;
          if (res.data.isRunman.status >= 2){
            title = '跑男中心';
            url = '/pages/runman/index';
            showQ = true;
          }else{
            title = '已申请为跑男，审核中';
            url = '/pages/runman/verify/verify';
            showQ = false;
          }
        }else{
          show = true
        }
        _this.setData({
          'navigator[3]': { icon: '/img/runman.png', label: title, url: url, show: show},
          'navigator[6].show': showQ,
          'navigator[7].show': res.data.agent.id ? true:false
        })
      }
    })
  },
  
})