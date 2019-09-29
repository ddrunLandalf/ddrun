const BaseRest = require('./orderBase.js');

module.exports = class extends BaseRest {
      //跑男确认完成
    async runAction () {
        let check = await this.checkRunman();
        if(!check.check){
            return this.fail(check.msg)
        }
        let ws = check.ws;
        let order = check.order;
        let appConfig = check.appConfig;
        if(order.status == 3 &&  order.ws_id == ws.id) {
            let update = await this.model('order').where({id: order.id}).update({
                ws_id: ws.id,
                status: 4
            })
            let time = think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss')
            await this.model('order_ope').where({order_id: order.id}).update({
                status_time4: time,
                ope_type4:2
            })
            if(order.pay_amount > 0){
                await this.userPayGrant(order,order.wx_id)
                await this.cents(order,order.wx_id)
            }
            if(order.order_type == 1){
                let appli = await this.model('opentp_app').where({app_key: order.opentp_key}).find();
                let http = await this.$http(appli.cb_url, 'POST', {
                    errmsg: '订单已完成',
                    status: 4,
                    order_no: order.order_no
                });
            }else{
                /**发送模板消息 */
                await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT0257'),order.form_ids.split(',')[2],'/pages/order/detail/detail?order_no='+order.order_no,{
                    keyword1: {value:'订单已完成'},
                    keyword2: {value:order.order_no},
                    keyword3: {value:time},
                    keyword4: {value:order.pay_amount}
                })
                /**发送模板消息 */
            }
            return this.success({},'已确认完成')
        }else{
            return this.fail('订单状态有误')
        }
    }

    //用户消费行为累计
    async userPayGrant(order,wx_id){
        let config = await this.getSysConfig('interal');
        let updateData = {
            grand_fee: ['exp','grand_fee +'+order.pay_amount]
        }
        if(config.config_content){
            config = JSON.parse(config.config_content);
            if(config.getInteral){
                let interal = order.pay_amount*config.getInteral;
                let vipSet = await this.getSysConfig('vip_set');
                if(vipSet.config_content){
                    vipSet = JSON.parse(vipSet.config_content);
                    let vip = await this.model('wxapp_vip').where({
                        wx_id: wx_id,
                        'TO_DAYS(deadline_time)':['exp','- TO_DAYS(NOW()) >0']
                    }).find()
                    if(vip.id && vipSet.open_double == 1){
                        interal = interal*2;
                    }
                }
                updateData.grand_integral = ['exp','grand_integral +'+interal];
                updateData.surplus_integral = ['exp','surplus_integral +'+interal];
            }
        }
        //累计消费 和积分
        await this.model('wxapp_user').where({id: wx_id}).update(updateData)
    }

    //订单金额分成
    async cents(order,wx_id){
        let agentConfig = await this.getSysConfig('service');
        order.start_address = JSON.parse(order.start_address);
        let agent ;
        if(agentConfig.config_content){
            agentConfig = JSON.parse(agentConfig.config_content);
            if(agentConfig.open_agent == 1){
                agent = await this.model('agent').where({city_name: order.start_address.city}).find();
                if(agent.id){
                    let agentService = await this.model('agent_service').where({agent_id: agent.id,service_type:order.service_type}).find();
                    if(agentService.id){
                        await this.docents(order,wx_id,agentService)
                    }
                }
            } else {
                let agentService = await this.model('agent_service').where({agent_id: 0,service_type:order.service_type}).find();
                if(agentService.id){
                    await this.docents(order,wx_id,agentService)
                }
            }
        }
    }

    //分成
    async docents(order,wx_id,agentService){
        if(order.pay_amount > 0){
            console.log(111)
            //跑男分成
            let rate_m = parseFloat(agentService.user_profit)/100;
            let profit_m = parseFloat(rate_m)*parseFloat(order.pay_amount);
            //代理分成
            let rate_a = parseFloat(agentService.agent_profit)/100;
            let profit_a = parseFloat(rate_a)*parseFloat(order.pay_amount);
            //平台分成
            let rate_p = 1-rate_m-rate_a;
            let profit_p = parseFloat(rate_p)*parseFloat(order.pay_amount);
            
            let cando_f = false;
            let cando_s = false;
            let rate_f = 0;
            let profit_fu = 0;
            let rate_s = 0;
            let profit_su = 0;
            let superior_id = 0; 
            let superior_super_id = 0; 
            
            if(cando_f && superior_id !=0){
                profit_fu = profit_p * rate_f;
            }

            if(cando_s && superior_super_id !=0){
                profit_su = profit_p * rate_s;
            }

            profit_p = profit_p - profit_fu - profit_su;
            let res = await this.model('order_cents').thenAdd({
                profit_m:profit_m,
                profit_a:profit_a,
                profit_p:profit_p,
                profit_fu:profit_fu,
                profit_su:profit_su,
                order_id: order.id,
                agent_id: agentService.agent_id,
                ws_id: order.ws_id,
                fu_id: superior_id,
                su_id: superior_super_id
            },{
                order_id: order.id
            })

            if(res.type == 'exist'){
                return this.fail('该订单已分成');
            }

            //跑男金额更新一下
            await this.model('wxapp_service').where({id: order.ws_id}).update({
                surplus_amount: ['EXP','surplus_amount+'+profit_m],
                cumulative_amount: ['EXP','cumulative_amount+'+profit_m]
            })


            //代理金额更新一下
            await this.model('agent').where({id: agentService.agent_id}).update({
                surplus_amount: ['EXP','surplus_amount+'+profit_a],
                grand_amount: ['EXP','grand_amount+'+profit_a]
            })

        }
    }
}