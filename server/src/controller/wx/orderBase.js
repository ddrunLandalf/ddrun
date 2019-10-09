const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    
    //检查跑男状态
    async checkRunman () {
        let userInfo = this.post('userInfo');
        let ws = await this.model('wxapp_service').where({wx_id: userInfo.id}).find();
        let order = await this.model('order').where({id: this.post('order_id')}).find();
        if(order.id){
            if(ws.id){
                if(ws.take_mode == 0){
                    return {check:false,msg:'您还没开启接单'}
                }
                if(ws.status == 3 || ws.status == 4){
                    return {check:false,msg:'您的服务已被暂停'}
                }else if(ws.status == 0 || ws.status == 1){
                    return {check:false,msg:'您还没有通过审核'}
                }else{
                    return {
                        check:true,
                        ws:ws,
                        order:order,
                        appConfig: JSON.parse((await this.getSysConfig('mwx_id_key')).config_content)
                    }
                }
            }else{
                return {check:false,msg:'对不起您不是跑男'}
            }
        }else{
            return {check:false,msg:'订单不存在'}
        }
    }
}