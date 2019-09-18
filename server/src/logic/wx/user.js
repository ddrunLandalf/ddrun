const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {

    /**
     * 微信小程序登录
     */
    async loginAction () {
        let rs = await this.checkRules(['js_code']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }

    /**
     * 绑定手机号
     */
    async bindPhoneAction () {
        let rs = await this.checkRules(['phone_number','user','code']);
        if(rs.is){
            return this.fail(rs.str)
        }
    }

    /**
     * 获取并绑定微信手机号
     */
    async getwxPhoneAction(){
        let rs = await this.checkRules(['encryptedData','iv']);
        if(rs.is){
            return this.fail(rs.str)
        }
    }
    /**
     * 发送短信验证码
     */
    async codeAction () {
        let rs = await this.checkRules(['phone_number']);
        if(rs.is){
            return this.fail(rs.str)
        }
    }
}