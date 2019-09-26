const util = {
  API: 'http://127.0.0.1:8360/', 
  /**
   * 获取窗口大小
   */
  getWindowSize(that) {
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          model: res.model,
          width: res.windowWidth,
          height: res.windowHeight,
          topHeight: res.statusBarHeight + 46,
          pageLength: pages.length
        })
      },
    })
  },
  login(cb) {
    var that = this;
    wx.login({
      success(res) {
        that.post('wx/user/login', { js_code: res.code }, function (res) {
          if (res.errno == 0) {
            wx.setStorageSync("token", res.data.token);
            wx.setStorageSync("phone", res.data.phone);
            wx.setStorageSync("wx_id", res.data.wx_id);

            cb(res)
          }
        })
      }
    })
  },
  //post请求
  post(url, data, success, fail) {
    this.http('POST', url, data, success, fail)
  },
  get(url, data, success, fail) {
    this.http('GET', url, data, success, fail)
  },

  http(method, url, data, success, fail) {
    //通用post接口实现方法
    var that = this;
    let _data = data || {};
    let _success = success || function (e) {
      console.log(e)
    };
    let _fail = fail || function (e) {
      console.log(e)
    };
    let _method = method || 'POST';
    let _header = {
      'content-type': 'application/x-www-form-urlencoded'
    };

    if (_method.toUpperCase() == 'GET') {
      _header = {
        'content-type': 'application/json'
      };
    }
    if (wx.getStorageSync("token")) {
      _header.token = wx.getStorageSync("token")
    }
    if (arguments.length == 2 && typeof _data == 'function') {
      _success = _data
    }
    let api = this.API;
    if (url.indexOf('http') > -1) {
      api = ''
    }
    wx.request({
      url: api + url,
      method: _method,
      header: _header,
      data: _data,
      success: function (res) {
        if (typeof _success == 'function' && res.statusCode != 404 && res.statusCode != 500 && res.statusCode != 400) {

          if(res.data.errno >= 1000){
            wx.showToast({
              title: res.data.errmsg + '',
              icon: 'none'
            })
            if (res.data.errmsg == '您还没开启接单') {
              wx.showModal({
                title: '您还没开启接单',
                content: '您可以前往跑男中心设置接单',
                confirmText: '立即前往',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/runman/status/status',
                    })
                  }
                }
              })
            }
          }else if(res.data.errno == -1){
            that.login(function (res) {
              that.http(method, url, data, success, fail)
            })
          }else if(res.data.errno == 101){
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              confirmText: '关闭',
              showCancel:false
            })
          }else {
            _success(res.data);
          }
          
        } else {
          if (typeof _success != 'function') { }
          wx.showToast({
            title: '接口  错误 ' + res.statusCode,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(`======== 接口  请求失败 ========`);
        if (typeof _fail == 'function') {
          _fail(res);
        }
      }
    });
  },
  dateFormat(day,hours, fmt) { //author: meizz 
    let timestamp;
    if(day == 1){
      timestamp = parseInt(new Date().valueOf()) + 24*60*60*1000
    }else{
      timestamp = new Date().valueOf()
    }
    let date = new Date(timestamp)
    var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": hours > -1 ? hours:date.getHours(), //小时 
      "m+": hours > -1 ? 0 :date.getMinutes(), //分 
      "s+": hours > -1 ? 0 :date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
 
  formatMsgTime(timespan) {
    var dateTime = new Date(timespan);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var now = new Date();
    var now_new = now.getTime(); //typescript转换写法

    var milliseconds = 0;
    var timeSpanStr;

    milliseconds = now_new - dateTime.getTime();

    if (milliseconds <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚';
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
    } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
      timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
    } else {
      timeSpanStr = timespan;
    }
    return timeSpanStr;
  },

  getTimeOptions(){
    let times = [
      { label: '00:00', value: 0 }, { label: '01:00', value: 1 }, { label: '02:00', value: 2 }, { label: '03:00', value: 3 }, { label: '04:00', value: 4 }, { label: '05:00', value: 5 }, { label: '06:00', value: 6 }, { label: '07:00', value: 7 }, { label: '08:00', value: 8 }, { label: '09:00', value: 9 }, { label: '10:00', value: 10 }, { label: '11:00', value: 11 },
      { label: '12:00', value: 12 }, { label: '13:00', value: 13 }, { label: '14:00', value: 14 }, { label: '15:00', value: 15 }, { label: '16:00', value: 16 }, { label: '17:00', value: 17 }, { label: '18:00', value: 18 }, { label: '19:00', value: 19 }, { label: '20:00', value: 20 }, { label: '21:00', value: 21 }, { label: '22:00', value: 22 }, { label: '23:00', value: 23 },
    ];

    let h = new Date().getHours();
    let arr = [{ label: '立即发货', value: -1 }]
    let temp = -1;
    for(let i in times){
      if(h < times[i].value-1){
        if (i < times.length - 1) {
          arr.push(times[i ])
        }
      }
    }
    for(let i in times){
      arr.push({label:'明天 '+times[i].label})
    }
    return arr
  }
}
module.exports = util