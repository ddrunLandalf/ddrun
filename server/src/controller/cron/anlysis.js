const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    async orderAction(){
        let an2 = await this.model('anlysis_order').where({
            'data_time': ['exp','=date_format(date_sub(now(), interval 2 day),"%Y-%m-%d")']
        }).find()
        if(!an2.id){
            //订单总量
            await this.addData(2);
        }
        let an = await this.model('anlysis_order').where({
            'data_time': ['exp','=date_format(date_sub(now(), interval 1 day),"%Y-%m-%d")']
        }).find()
        if(!an.id){
            an2 = await this.model('anlysis_order').where({
                'data_time': ['exp','=date_format(date_sub(now(), interval 2 day),"%Y-%m-%d")']
            }).find()
            //订单总量
            await this.addData(1,an2)
        }
        
    }

    /**
     * 添加订单数据
     */
    async addData(day,an2){
        let orderTotal = await this.model('order').where('TO_DAYS(create_time) = TO_DAYS(date_sub(now(), interval '+day+' day)) ').field('COUNT(*) total').find();
        let oTotal = (await this.model('order').dayAnlysis(day))[0];
        let apm = (await this.model('order_cents').getOverview(day))[0];
        let add = await this.model('anlysis_order').thenAdd({
            'data_time': ['exp','date_format(date_sub(now(), interval '+day+' day),"%Y-%m-%d")'],
            order_total: orderTotal.total || 0,
            complete_total: oTotal.complete_total,
            cancel_total: oTotal.cancel_total,
            amount_total: oTotal.amount_total,
            refund_total: oTotal.refund_total,
            harvest_total: parseFloat(oTotal.amount_total) - parseFloat(oTotal.refund_total),
            discount_amount_total: oTotal.discount_amount_total,
            interal_amount_total: oTotal.interal_amount_total,
            interal_use_number:oTotal.interal_use_number,
            distance_total:oTotal.distance_total,
            night_price_total:oTotal.night_price_total,
            weight_price_total:oTotal.weight_price_total,
            platform_profit_total: apm.profit_p_total || 0,
            runman_profit_total: apm.profit_m_total || 0,
            agent_profit_total:apm.profit_a_total || 0,
            growth:an2 ? ((parseInt(oTotal.complete_total)-parseInt(an2.complete_total))/parseInt(an2.complete_total))*100 :0,
            growth_amount: an2 ? ((parseInt(oTotal.amount_total)-parseInt(an2.amount_total))/parseInt(an2.amount_total))*100:0
        },{
            'data_time': ['exp','=date_format(date_sub(now(), interval '+day+' day),"%Y-%m-%d")']
        })
        console.log(add)
    }

    /**
     * 微信用户
     */
    async wxuserAction () {
        let an2 = await this.model('anlysis_wxuser').where({
            'data_time': ['exp','=date_format(date_sub(now(), interval 2 day),"%Y-%m-%d")']
        }).find()
        if(!an2.id){
            //订单总量
            await this.addwxuserData(2);
        }
        let an = await this.model('anlysis_wxuser').where({
            'data_time': ['exp','=date_format(date_sub(now(), interval 1 day),"%Y-%m-%d")']
        }).find()
        if(!an.id){
            an2 = await this.model('anlysis_wxuser').where({
                'data_time': ['exp','=date_format(date_sub(now(), interval 2 day),"%Y-%m-%d")']
            }).find()
            //订单总量
            await this.addwxuserData(1,an2)
        }
    }

    async addwxuserData(day,an2){
        let userTotal = await this.model('wxapp_user').where('TO_DAYS(create_time) = TO_DAYS(date_sub(now(), interval '+day+' day)) ').field('count(*) total').find();
        let register = await this.model('phone').where('TO_DAYS(create_time) = TO_DAYS(date_sub(now(), interval '+day+' day)) and user_type=2').field('count(*) total').find();
        let add = await this.model('anlysis_wxuser').thenAdd({
            'data_time': ['exp','date_format(date_sub(now(), interval '+day+' day),"%Y-%m-%d")'],
            user_total: userTotal.total,
            regist_total: register,
            growth: an2 ?  ((parseInt(userTotal.total)-parseInt(an2.user_total))/parseInt(an2.user_total))*100 :0
        },{
            'data_time': ['exp','=date_format(date_sub(now(), interval '+day+' day),"%Y-%m-%d")']
        })
    }
}