const BaseRest = require('../rest.js');
const jwt = require('jsonwebtoken');
const alisms = require('../../utils/alisms');
module.exports = class extends BaseRest {

    /**
     * 微信小程序登录
     */
    async loginAction () {
        let wxconfig = await this.getSysConfig('mwx_id_key');
        if(wxconfig.config_content){
            wxconfig = JSON.parse(wxconfig.config_content);
            let http = await this.$http('https://api.weixin.qq.com/sns/jscode2session?appid=' +
            wxconfig.appid + '&secret=' + wxconfig.app_secert + '&js_code=' +
                this.post('js_code') + '&grant_type=authorization_code', 'GET', {});
            let phone = '';
            if(http.openid){
                await this.model('wxapp_login_log').add({
                    openid: http.openid,
                    session_key: http.session_key
                })
                //查询用户是否存在
                let u = await this.model('wxapp_user').where({openid:http.openid}).find();
                let user_id;
                if(u.id){
                    //用户存在
                    user_id = u.id;
                    let findphone = await this.model('phone').where({user_type:2,user_id:user_id}).find();
                    phone = findphone.id ? findphone.phone_number:'';
                }else{
                    //不存在，添加用户
                    let add = await this.model('wxapp_user').thenAdd({openid: http.openid, status:1}, {openid: http.openid});
                    user_id = add.id;
                    
                }
                //生成token
                let token = jwt.sign({
                    user_id:user_id,
                    openid: http.openid,
                    type: 2
                }, global.jwtSecret, { expiresIn: '2h' });
                return this.success({
                    token:token,
                    phone:phone,
                    wx_id:user_id
                },'登录成功')
            }else{
                return this.fail(http.errcode,http.errmsg)
            }
        }else{
            return this.fail('还没有配置小程序的APPID或app_secret')
        }
    }

    

    /**
     * 小程序绑定手机号
     */
    async bindPhoneAction () {
        let phoneNumber = this.post('phone_number');
        let check = await this.model('phone_code').where({
            code: this.post('code'),
            phone_number: this.post('phone_number')
        })
        .field('id,timestampdiff(second, create_time, now()) as time')
        .order('create_time desc').find();
        if(!check.id){
            return this.fail('验证失败')
        }
        if(check.time > 60*10){
            return this.fail('验证码已过期')
        }
        await this.bindPhone(phoneNumber);
    }

    /**
     * 获取并绑定微信手机号
     */
    async getwxPhoneAction(){
        let sessionKey = await this.model('wxapp_login_log').where({openid: this.post('userInfo').openid}).order('create_time desc').find();
        if(sessionKey.id){
            sessionKey = sessionKey.session_key
        }else{
            return fail('sessionKey获取失败')
        }
        let phoneRes = await this.wXBizDataCrypt(sessionKey,this.post('encryptedData'),this.post('iv') );
        if(phoneRes.phoneNumber){
            await this.bindPhone(phoneRes.phoneNumber);
        }else{
            return fail('手机号获取失败')
        }
    }

    

    /**
     * 执行手机号绑定
     */
    async bindPhone (phoneNumber) {
        let user = '';
        let tokenUser= this.post('userInfo');

        if(this.post('user')){
            user = JSON.parse(this.post('user'));
            //更新用户信息
            await this.model('wxapp_user').where({id:tokenUser.id}).update({
                nick_name: user.nickName,
                avatar_url: user.avatarUrl,
                gender: user.gender,
                province:user.province,
                city:user.city
            })
        }
        let isPhone = await this.model('phone').where({user_type: 2,phone_number:phoneNumber}).find();
        if(isPhone.id){
            return this.fail('手机号已被注册')
        }
        let isPhoneExist = await this.model('phone').where({user_id: tokenUser.id,user_type: 2}).find();
        let opType = 1; //操作类型1为绑定 2.为更换手机号
        if(isPhoneExist.id){
            opType = 2;
            let bind = await this.model('phone').where({id: isPhoneExist.id}).update({phone_number: phoneNumber},{
                phone_number: phoneNumber
            });
            if(bind){
                //添加操作日志
                let padd = await this.model('phone_log').add({
                    user_id: tokenUser.id,
                    phone_number: phoneNumber,
                    user_type: 2,
                    op_type: 2
                })
                
                return this.success({phone:phoneNumber},'更换手机号成功')
            }else{
                return this.fail('更换手机号失败')
            }
        }else{
            let bind = await this.model('phone').thenAdd({
                phone_number: phoneNumber,
                user_id: tokenUser.id,
                user_type: 2
            },{phone_number: phoneNumber,user_type: 2})
            if(bind.type == 'add'){
                //添加操作日志
                await this.model('phone_log').add({
                    user_id: tokenUser.id,
                    user_type: 2,
                    phone_number: phoneNumber,
                    op_type: 1
                })
               
                return this.success({phone:phoneNumber},'绑定手机号成功')

            }else{
                return this.fail('手机号已被注册')
            }
        }
    }

    /**
     * 获取微信小程序用户信息 
     */
    async infoAction () {
        let userInfo = this.post('userInfo');
        
        //是否已注册跑男
        let isRunman = await this.model('wxapp_service').where({wx_id: userInfo.id}).field('id,status').find();
        //手机号
        let phone = await this.model('phone').where({user_type:2,user_id:userInfo.id}).find();
        //是否是平台
        let agent = await this.model('agent').where({wx_id: userInfo.id}).find();
        
        return this.success({
            userInfo,phone,isRunman,agent
        })
    }

    /**
     * 获取用户列表
     */
    async listAction(){
        let whereOptions = {};
        this.post('phone_number') ? whereOptions['erd_phone.phone_number'] = ['LIKE','%'+this.post('phone_number')+'%']:'';
        this.post('nick_name') ? whereOptions['erd_wxapp_user.nick_name']   = ['LIKE','%'+this.post('nick_name')+'%']:'';
        this.post('status') !== "" ? whereOptions['erd_wxapp_user.status'] = this.post('status'):'';
        whereOptions['erd_phone.user_type'] = 2;

        let result = await this.model('wxapp_user').join({ table: 'phone',  join: 'left', on: ['id', 'user_id'] })
            .where(whereOptions)
            .order('erd_wxapp_user.create_time desc')
            .group('erd_wxapp_user.id')
            .field("erd_wxapp_user.*,erd_phone.phone_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();
        let count = await this.model('phone').where({user_type: 2,phone_number:['like','%'+this.post('phone_number')+'%']}).count();
        result.count = count
        return this.success(result)
    }

    /**
     * 发送短信验证码
     */
    async codeAction () {
        let dos = await this.model('phone_code').where(
            'timestampdiff(second, create_time, now()) < 10*60 and wx_id='+this.post('userInfo').id
        ).field('(timestampdiff(second, create_time, now())) as time').select();
        if(dos.length >= 3){
            return this.fail('操作过于频繁，请稍后再试')
        }
        
        let code = parseInt(Math.random() * (9999 - 1000 + 1) + 1000, 10);
        let res = await this.model('phone_code').add({
            code: code,
            wx_id: this.post('userInfo').id,
            phone_number: this.post('phone_number')
        })
        /**
         * 发送短信
         */
        let smsConfig = await this.getSysConfig('ali_sms');
        if(smsConfig.config_content){
            smsConfig = JSON.parse(smsConfig.config_content);
            alisms.sendSms(smsConfig.accessKeyId,smsConfig.accessKeySecret,{
                "RegionId": "default",
                "PhoneNumbers": this.post('phone_number'),
                "SignName": smsConfig.signName,
                "TemplateCode": smsConfig.verifyTpCode,
                "TemplateParam": JSON.stringify({code: code})
            })
        }
        return this.success({},'ok')
    }
}