const BaseRest = require('./orderBase.js');
const wx = require('../../utils/wxpay');
const fs = require('fs');

module.exports = class extends BaseRest {

    /**
     * 用户取消订单
     */
    async userAction (){
        let userInfo = this.post('userInfo');
        //查询订单支付了多少时间
        let dif_minute = await this.model('order_ope').where({order_id:this.post('order_id')}).field('(UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(status_time2))/60 dif_minute').find();
        let order = await this.model('order').where({id:this.post('order_id')}).find();
        if(!order.id){
            return this.fail('订单不存在')
        }
        if(userInfo.id != order.wx_id){
            return this.fail('该订单不是您的')
        }
        if(order.status == 4 ||order.status == 3){
            return this.fail('该订单已配送完成，不可取消')
        }
        
        let refund_fee = order.pay_amount;
        let fineAmount = 0; //超时订单罚款

        let cancelConfig = await this.getSysConfig('cancel_order');
        let refund = {};
        if(order.status == 1 || order.status == 2){
            if(cancelConfig.config_content){
                cancelConfig = JSON.parse(cancelConfig.config_content);
                if(dif_minute.dif_minute > cancelConfig.freeCancelTime){
                    fineAmount = cancelConfig.bearCostRate*refund_fee;
                    refund_fee = parseFloat(refund_fee) - parseFloat(cancelConfig.bearCostRate*refund_fee);
                }
            }
            refund = await this.wxpayRefund(order,refund_fee);
            if(refund.return_code[0] != 'SUCCESS'){
                return this.fail(refund.return_msg[0],refund)
            }
        }
        
        let update = await this.model('order').where({id: order.id}).update({
            status: order.status==0?-1:-2,
            refund_no: refund.out_refund_no || '',
            refund_status:order.status==0 ? 0:1,
            refund_amount: order.status==0 ? 0:refund_fee
        })

        await this.model('order_ope').where({order_id: order.id}).update({
            status_time2_: order.status==0 ? '':think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss'),
            status_time1_: order.status!=0 ? '':think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss'),
            ope_type2_: 1,
            refund_reason:this.post('seasonInput'),
            refund_fine: fineAmount
        })

        await this.backDiscount(order.wx_id,order.interal_value,order.wxcoupon_id)
        /**发送模板消息 */
        let appConfig = JSON.parse((await this.getSysConfig('mwx_id_key')).config_content)
        await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT0024'),order.form_ids.split(',')[3],'/pages/order/detail/detail?order_no='+order.order_no,{
            keyword1: {value:order.order_no},
            keyword2: {value: order.status==0 ? 0:refund_fee},
            keyword3: {value:this.post('seasonInput')},
            keyword4: {value:'下单用户'}
        })
        /**发送模板消息 */
        return this.success({},'退款成功')

    }

    /**
     * 跑男取消订单
     */
    async runmanAction(){
        let check = await this.checkRunman();
        if(!check.check){
            return this.fail(check.msg)
        }
        let ws = check.ws;
        let order = check.order;
        let appConfig = check.appConfig;
        if(order.status != 4 && order.status != 3 && (order.ws_id == 0 || order.ws_id == ws.id)){
            let refund_fee = order.pay_amount;
            let res = await this.model('order_ope').where({order_id: order.id}).field('*,(UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(status_time2))/60 dif_minute').find();
            
            let refund = await this.wxpayRefund(order,refund_fee);
            if(refund.return_code[0] == 'SUCCESS'){
                let update = await this.model('order').where({id: order.id}).update({
                    status: -2,
                    refund_no: refund.out_refund_no,
                    refund_status:1,
                    refund_amount:refund_fee
                })

                let fineAmount = 0;
                let cancelConfig = await this.getSysConfig('cancel_order');
                if(cancelConfig.config_content){
                    cancelConfig = JSON.parse(cancelConfig.config_content);
                    if(res.dif_minute > cancelConfig.freeCancelTime){
                        fineAmount = cancelConfig.bearCostRate*refund_fee;
                        await this.model('wxapp_service').where({id:ws.id}).update({
                            fine_amount:['exp','fine_amount+'+fineAmount],
                            surplus_amount: ['exp','surplus_amount-'+fineAmount],
                        })

                    }
                }

                await this.model('order_ope').where({order_id: order.id}).update({
                    status_time2_: think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss'),
                    ope_type2_: 2,
                    refund_reason:this.post('seasonInput'),
                    refund_fine: fineAmount
                })
                if(fineAmount > 0){
                    await this.model('order_cents').add({
                        order_id: order.id,
                        ws_id: ws.id,
                        profit_m: '-'+fineAmount
                    })
                }

                await this.backDiscount(order.wx_id,order.interal_value,order.wxcoupon_id)
                /**发送模板消息 */
                await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT0024'),order.form_ids.split(',')[3],'/pages/order/detail/detail?order_no='+order.order_no,{
                    keyword1: {value:order.order_no},
                    keyword2: {value: refund_fee},
                    keyword3: {value:this.post('seasonInput')},
                    keyword4: {value:'下单用户'}
                })
                /**发送模板消息 */
                return this.success({},'退款成功')

            }else{
                return this.fail(refund.return_msg[0],refund)
            }
            
        }else{
            return this.fail('订单状态有误')
        }
    }
    //退还优惠券或积分
    async backDiscount (wx_id,interal_value,wxcoupon_id) {
        
    }

    //退款
    async wxpayRefund(order,refund_fee){
        let config = await this.getSysConfig('mwx_mch');
        if(config.config_content){
            config = JSON.parse(config.config_content)
        }else{
            return this.fail('微信支付未配置完全')
        }
        let appConfig = await this.getSysConfig('mwx_id_key');
        if(appConfig.config_content){
            appConfig = JSON.parse(appConfig.config_content)
        }else{
            return this.fail('微信支付未配置完全')
        }
        let formData = wx.wxpayReund(order,refund_fee,appConfig,config);
        let http = await this.$http('','',{},{},{
            url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
            method: 'POST',
            json: formData,
            agentOptions: {
                pfx: fs.readFileSync(think.ROOT_PATH + '/'+config.apiclient_cert),
                passphrase: config.mchid
            }
        })
        // http.out_refund_no = formData.out_refund_no;
        if(typeof http == 'string'){
            http = await wx.parseString(http)
        }
        return http.xml
    }

    //关闭支付
    async closeAction (){
        let userInfo = this.post('userInfo');
        let order = await this.model('order').where({order_no:this.post('order_no')}).find();
        if(!order.id){
            return this.fail('订单不存在')
        }
        if(userInfo.id != order.wx_id){
            return this.fail('该订单不是您的')
        }
        if(order.status != 0){
            return this.fail('该订单已支付或已取消')
        }
        let update = await this.model('order').where({id: order.id}).update({
            status: -1,
        })

        await this.model('order_ope').where({order_id: order.id}).update({
            status_time1_: order.status!=0 ? '':think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss'),
            ope_type2_: 1,
        })

        await this.backDiscount(order.wx_id,order.interal_value,order.wxcoupon_id)
        /**
         * 此处编写接单通知
         */
        return this.success({},'订单已关闭')
    }
}