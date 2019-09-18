const BaseRest = require('../rest.js');
const sha1 = require('sha1');
const xml2js = require('xml2js');
module.exports = class extends BaseRest {

    async devAction(){
        if(this.isGet){
            this.ctx.body = await this.check();
            return this.ctx.body
        }
        if(this.isPost){
            this.ctx.body =await this.reciveMsg();
            return this.ctx.body
        }
    }

    //验证微信接口
    async check(){
        let config = await this.getSysConfig('wxp_set');
        if(!config.config_content){
            return 'wong'
        }
        config = JSON.parse(config.config_content);

        let token = config.token
        let signature = this.get('signature')
        let nonce = this.get('nonce')
        let timestamp = this.get('timestamp')
        let echostr = this.get('echostr')
        let str = [token, timestamp, nonce].sort().join('')
        let sha = sha1(str)

        if (sha == signature) {
            return echostr + ''
        } else {
            return 'wong'
        }
    }

    //接收消息
    async reciveMsg(){
        const data = this.post('xml')
        let result = "";
        if(data.Content[0].length == 11){
            result = await this.bindNumber(data);
        }
        return result
    }

    //根据手机号绑定公众号
    async bindNumber(data){
        let result = '';
        let wx = await this.model('phone').where({phone_number:data.Content[0],user_type:2}).find();
        if(!wx.id){
            result = await this.formatText(data.FromUserName[0], data.ToUserName[0], data.CreateTime[0], '该手机号还没有注册');
        }else{
            let wxp = await this.model('wxpublic_user').thenAdd({
                openid: data.FromUserName[0],
                wx_id: wx.user_id
            },{
                openid: data.FromUserName[0]
            })
           if(wxp.type == 'exist') {
               result = await this.formatText(data.FromUserName[0], data.ToUserName[0], data.CreateTime[0], '该手机号已经绑定过了');
           }else{
               result = await this.formatText(data.FromUserName[0], data.ToUserName[0], data.CreateTime[0], '绑定成功');
           }

        }
        return result
    }

    //格式化消息内容
    async formatText(FromUserName, ToUserName, CreateTime, str) {
        return '<xml>' +
            '<ToUserName><![CDATA[' + FromUserName + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + ToUserName + ']]></FromUserName>  ' +
            '<CreateTime>' + CreateTime + '</CreateTime>' +
            '<MsgType><![CDATA[text]]></MsgType>' +
            '<Content><![CDATA[' + str + ']]></Content>' +
            '</xml>'
    }

    async parseXML(xml) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, {
                trim: true,
                explicitArray: false,
                ignoreAttrs: true
            }, function (err, result) {
                if (err) {
                    return reject(err)
                }
                resolve(result.xml)
            })
        })
    }
    
}