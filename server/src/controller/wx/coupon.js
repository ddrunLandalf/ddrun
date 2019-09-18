const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    /**
     * 获取未被查看的优惠券
     */
    async lookAction () {
        let userInfo = this.post('userInfo');
        let res = await this.model('wxapp_coupon').where({wx_id:userInfo.id,is_look:0,is_use:0 }).find();
        if(res.id){
            await this.model('wxapp_coupon').where({id:res.id}).update({is_look:1})
        }
        return this.success(res)
    }

    /**
     * 获取未使用的优惠券
     */
    async nouseAction () {
        let userInfo = this.post('userInfo');
        let res = await this.model('wxapp_coupon').where(
            'TO_DAYS(deadline_time) - TO_DAYS(NOW()) >0 and wx_id='+ userInfo.id +' and is_use=0')
        .order('create_time desc')
        .page(this.post('currentPage'),this.post('pageSize')).countSelect();
        return this.success(res)
    }

    /**
     * 获取已过期的优惠券
     */
    async deadlineAction () {
        let userInfo = this.post('userInfo');
        let res = await this.model('wxapp_coupon').where(
            'TO_DAYS(deadline_time) - TO_DAYS(NOW()) <=0 and wx_id='+ userInfo.id +' and is_use=0')
            .order('deadline_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();
        return this.success(res)
    }

    /**
     * 会员领取优惠券
     */
    async vipDrawAction () {
        let couponId = this.post('couponId');
        let userInfo = this.post('userInfo');
        let type = this.post('dayType'); //daytype = 1 今日 2  本周  3.本月
        let whereOptions = {
            coupon_id: couponId,
            wx_id: userInfo.id
        };
        let failtext = '';
        let truetext = '';
        if(type == 1){
            whereOptions['to_days(create_time)'] = ['exp','=to_days(now())'];
            whereOptions.origin_des = '会员今日领取';
            failtext = '您今天已经领取过了';
            truetext = '会员今日领取';
        }else if(type == 2){
            whereOptions['YEARWEEK(now())'] = ['exp',"=YEARWEEK(date_format(create_time,'%Y-%m-%d'))"];
            whereOptions.origin_des = '会员本周领取';
            failtext = '您本周已经领取过了';
            truetext = '会员本周领取';
        }else{
            let date = think.datetime(new Date(), 'YYYY-MM');
            whereOptions.create_time = ['LIKE',date+'%'];
            whereOptions.origin_des = "会员本月领取";
            failtext = '您本月已经领取过了';
            truetext = '会员本月领取';
        }
        let isDraw = await this.model('wxapp_coupon').where(whereOptions).find();
        if(isDraw.id){
            return this.fail(failtext)
        }
        let coupon = await this.model('coupon').where({id:couponId}).find();
        if(!coupon.id){
            return this.fail('优惠券不存在')
        }
        if(coupon.status == 2 || coupon.status == 3){
            return this.fail('优惠券不可领取')
        }
        if(coupon.limit_no != -1 && coupon.limit_no == coupon.cumulative_draw_no){
            return this.fail('优惠券领取已达上限')
        }
        let add = await this.model('wxapp_coupon').add({
            coupon_id: couponId,
            wx_id: userInfo.id,
            is_use:0,
            is_look: 1,
            origin_des: truetext,
            deadline_time:['exp','date_add(now(), interval '+coupon.deadline_days+' day)']
        })
        if(add){
            return this.success({id:add},'领取成功')
        }else{
            return this.fail('领取失败')
        }
    }

}