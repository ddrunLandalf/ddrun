const assert = require('assert');
const jwt = require('jsonwebtoken');
const Core = require('@alicloud/pop-core');
const request = require("request");
const crypto = require('crypto');
const wxpay = require('../utils/wxpay');
const fs = require('fs');

module.exports = class extends think.Controller {

  static get _REST() {
    return true;
  }

  constructor(ctx) {
    super(ctx);
    this.resource = this.getResource();
    assert(think.isFunction(this.model), 'this.model must be a function');
    this.modelInstance = this.model(this.resource);
    // this.sysConfig = this.getSysConfig();
  }

  async __before() {
    //用户的token
    let userIdentity = this.ctx.header.token;
    //访问的API
    let visitApi = this.ctx.request.url;
    if(visitApi != '/admin/login' && visitApi != '/wx/user/login'  && visitApi.indexOf('/wxp/') == -1 && visitApi.indexOf('cron/') == -1 && visitApi != '/' && visitApi.indexOf('opentp/v') == -1){
      let user = await jwt.verify(userIdentity,global.jwtSecret, (err, decoded) => {
        if (err) {
          return -1 //会输出123，如果过了60秒，则有错误。
        } else {
            return decoded
        }
      });

      //user有两个值 user_id为用户id ，type为用户类型 type=1为管理员 type=2为微信小程序用户
      if(user == -1){
        return this.fail(-1,'token已过期');
      }else{
        if(user.type == 1){
          //管理员访问
          let userInfo = await this.model('admin').where({id:user.user_id}).find();
          if(!userInfo.id){
            return this.fail('用户不存在或已被删除');
          }else if(userInfo.status == 0){
            return this.fail('您的账户已被禁用');
          }else if(userInfo.is_recover == 1){
            return this.fail('您的账户已被回收');
          }else{
            let isAuth = await this.checkAuth(userInfo);
            if(isAuth){
              this.post('userInfo',userInfo)
            }else{
              return this.fail('您无权访问');
            }
          }
        }else if(user.type == 2){
          //微信用户的访问
          let userInfo = await this.model('wxapp_user').where({id:user.user_id}).find();
          if(!userInfo.id){
            return this.fail('用户不存在');
          }else if(userInfo.status == 0){
            return this.fail('您的账户已被封');
          }else{
            this.post('userInfo',userInfo)
          }
        }
      }
      
    }
  }

  /**
   * 检查是否有权限
   */
  async checkAuth (userInfo) {
    if(userInfo.id == 1){
      return true
    }
    let role = await this.model('role').where({id: userInfo.role_id}).find();
    if(!role.id){
      
      return false
    }
    let auth_api = this.ctx.request.url;
    let auth_type =1;
    if(auth_api.indexOf('/config/') > -1){
      auth_api = this.post('config_key');
      auth_type = 2; 
    }
    let res = await this.model('auth_give').checkAuth(role.id,this.ctx.request.url,auth_type);
    return res
  }
  /**
   * get resource
   * @return {String} [resource name]
   */
  getResource() {
    return this.ctx.controller.split('/').pop();
  }

  /**获取平台配置 */
  async getSysConfig(config_key){
    if(config_key){
      let cacheData = await this.cache(config_key);
        if(cacheData){
            return cacheData
        }else{
            let res = await this.model('config').where({config_key:config_key}).find();
            if(res.id){
                await this.cache(config_key,res);
            }
            return res 
        }
    }
  }
 
  /**
   * 发送短信
   */
  async sendSms () {
    var client = new Core({
      accessKeyId: '<accessKeyId>',
      accessKeySecret: '<accessSecret>',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
    
    var params = {
      "RegionId": "default"
    }
    
    var requestOption = {
      method: 'POST'
    };
    
    client.request('SendSms', params, requestOption).then((result) => {
      console.log(JSON.stringify(result));
    }, (ex) => {
      console.log(ex);
    })
  }

  /**外部http请求 */
  async $http(url, type, data, headers,options) {
    let _options = {
        url: url,
        headers: headers,
        method: type,
        json: data
    }
    if(options){
      _options = options
    }
    return new Promise(function (resolve, reject) {
        request(_options, (err, res, body) => {
            
            if (res.statusCode == 200) {
                resolve(body)
            } else {
                console.log(res.statusCode)
            }
        })
    })
  }

  /**
   * 微信信息解密
   */
  async wXBizDataCrypt (_sessionKey,encryptedData, iv) {
    let appId = JSON.parse((await this.getSysConfig('mwx_id_key')).config_content).appid;
    // base64 decode
    let sessionKey = new Buffer(_sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')

    try {
      // 解密
      let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      
      decoded = JSON.parse(decoded)

    } catch (err) {
      throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== appId) {
      throw new Error('Illegal Buffer')
    }

    return decoded
  }

  //计算路程 一对多
  async getDistance(from,to){
    let mapConfig = await this.getSysConfig('map_key');
    if(mapConfig.config_content){
        mapConfig = JSON.parse(mapConfig.config_content);
        let distance = await this.$http('https://apis.map.qq.com/ws/distance/v1/?mode=driving&from='+ from +
            '&to='+to+ '&key='+mapConfig.key);
        return JSON.parse(distance)
    }else{
        return this.fail('请腾讯地图key')
    }   
  }

  //时间
  times () {
    let times = [
      {label:'00:00',value:0},{label:'01:00',value:1},{label:'02:00',value:2},{label:'03:00',value:3},{label:'04:00',value:4},{label:'05:00',value:5},
      {label:'06:00',value:6},{label:'07:00',value:7},{label:'08:00',value:8},{label:'09:00',value:9},{label:'10:00',value:10},{label:'11:00',value:11},
      {label:'12:00',value:12},{label:'13:00',value:13},{label:'14:00',value:14},{label:'15:00',value:15},{label:'16:00',value:16},{label:'17:00',value:17},
      {label:'18:00',value:18},{label:'19:00',value:19},{label:'20:00',value:20},{label:'21:00',value:21},{label:'22:00',value:22},{label:'23:00',value:23},
    ]
    return times
  }

  //微信支付
  async unifiedorder(des,totalFee){
    let userInfo = this.post('userInfo');
    let appConfig = await this.getSysConfig('mwx_id_key');
    if(appConfig.config_content){
      appConfig = JSON.parse(appConfig.config_content)
    }
    let mchConfig = await this.getSysConfig('mwx_mch');
    if(mchConfig.config_content){
      mchConfig = JSON.parse(mchConfig.config_content);
    }else{
      return this.fail('微信支付未配置')
    }
    let timestamp = Math.round(new Date().getTime() / 1000); // 当前时间
    let bodyData = wxpay.wxpayBodyData(userInfo.openid,totalFee,des,appConfig,mchConfig,this.ctx.ip);
    let urlStr = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    let http = await this.$http(urlStr,'POST',bodyData.bodyData);
    if(typeof http == 'string'){
      let result = await wxpay.parseString(http);
      if(result.xml.return_code[0] == 'FAIL'){
        return {
          code:false,
          msg: result.xml.return_msg[0]
        }
      }else{
          
        return {
          code:true,
          out_trade_no:bodyData.out_trade_no,
          nonceStr:result.xml.nonce_str[0],
          timestamp:timestamp.toString(),
          package:"prepay_id=" + result.xml.prepay_id[0],
          paySign: wxpay.paysignjs(
            appConfig.appid,
            result.xml.nonce_str[0],
            "prepay_id=" + result.xml.prepay_id[0],
            "MD5",
            timestamp,
            mchConfig.mch_secert
          )
        }
      }
    }else{
      return this.fail(result.xml.return_msg[0])
    }
  }

  //查询微信订单
  async wxFindOrder(order_no){
    let appConfig = await this.getSysConfig('mwx_id_key');
    if(appConfig.config_content){
      appConfig = JSON.parse(appConfig.config_content)
    }
    let mchConfig = await this.getSysConfig('mwx_mch');
    if(mchConfig.config_content){
      mchConfig = JSON.parse(mchConfig.config_content);
    }else{
      return this.fail('微信支付未配置')
    }
    let http = await this.$http('https://api.mch.weixin.qq.com/pay/orderquery','POST',wxpay.wxpayFindOrder(order_no,appConfig,mchConfig));
    if(typeof http == 'string'){
      http = await wxpay.parseString(http);
    }
    return http.xml
  }

  //获取微信token
  async wxToken (appid,secret,name){
    let token = await this.cache(name);
    if(token){
        return token
    }else{
        let http = await this.$http('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,'GET',{});
        if(http.access_token){
            await this.cache(name,http.access_token,{
                timeout: http.expires_in *1000
            })
            return http.access_token
        }else{
            return this.fail(http.errmsg)
        }
    }
  }

  /**
     * 小程序发送模板消息
     * @param {*} touser 用户openid
     * @param {*} template_id 模板id
     * @param {*} url  跳转路径
     * @param {*} appid 
     * @param {*} pagepath 小程序页面
     * @param {*} data 数据
     */
    async templateNotice (appid,secret,name,touser,template_id,form_id,pagepath,data) {
      let token = await this.wxToken(appid,secret,name);
      let http = await this.$http('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+token,'POST',{
          touser:touser, 
          template_id:template_id,
          page:pagepath,
          data:data,
          form_id:form_id
      });
      console.log(http)
  }

  

  //获取模板ID
  async getWxappTemplateId(id){
    let arr = await this.getSysConfig('wxapp_template');
    if(arr.config_content){
      arr = JSON.parse(arr.config_content).templates;
      let temp = '';
      for(let i in arr){
        if(arr[i].id == id){
          temp = arr[i].templateId
        }
      }
      return temp
    }
  }

  __call(){

  }
 
};