const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取服务配置
     */
    async serviceAction(){
        let config = await this.getSysConfig('service');
        return this.success(config)
    }

    /**
     * 获取小程序配置
     */
    async wxappAction(){
        let config = await this.getSysConfig('mwx_page_setting');
        if(config.config_content){
            config = JSON.parse(config.config_content)
            return this.success(config)
        }else{
            return this.success({})
        }
    }

    /**
     * 获取推广配置
     */
    async retailAction () {
        let config =await this.getSysConfig('mwx_page_setting');
        let open = false;
        if(config.config_content){
            config = JSON.parse(config.config_content)
            if(config.type == 2){
                let userInfo = this.post('userInfo');
                let r = await this.model('wxapp_retail_user').where({wx_id: userInfo.id}).find();
                if(r.id){
                    open = true
                }
            }else{
                open = true
            }
        }else{
            open = false;
        }
        return this.success({open:open},'ok')
    }

    /**
     * 获取会员配置
     */
    async vipAction(){
        let config = await this.getSysConfig('vip_set');
        if(config.config_content){
            config = JSON.parse(config.config_content);
            let dayCoupons = [];
            let weekCoupons = [];
            let monthCoupons = [];

            if(config.dayCoupons){
                dayCoupons = await this.model('coupon')
                .where({ 'id':['IN',config.dayCoupons] }).select();
            }
            if(config.weekCoupons){
                weekCoupons = await this.model('coupon')
                .where({ 'id':['IN',config.weekCoupons] }).select();
            }
            if(config.monthCoupons){
                monthCoupons = await this.model('coupon')
                .where({ 'id':['IN',config.monthCoupons]}).select();
            }

            return this.success({
                config: config,
                dayCoupons: dayCoupons,
                weekCoupons:weekCoupons,
                monthCoupons:monthCoupons
            })
        }else{
            return this.fail('会员未配置 ')
        }
    }

    /**
     * 获取文本
     */
    async textAction(){
        let config = await this.getSysConfig(this.post('name'));
        console.log(config)
        return this.success(config)
    }
}