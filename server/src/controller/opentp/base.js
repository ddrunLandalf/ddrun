const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    
    async __before(){
        let app_key = this.post('app_key');
        let app = await this.model('opentp_app').where({app_key: app_key}).find();
        if(!app.id){
            return this.fail(1001,'app_key不存在')
        }
        let ip = this.ip.replace('::ffff:','')
        if(app.ip_white_list != '*'){
            let whiteList = app.ip_white_list.split(',');
            let temp = -1;
            for(let i in whiteList){
                if(whiteList[i] == ip){
                    temp = i;
                }
            }
            if(temp == -1){
                return this.fail(1002,'您的ip：'+ip+' 不允许访问')
            }
        }
        await this.model('opentp_app').where({app_key: app_key}).update({
            grant_visit_no: ['EXP','grant_visit_no+1']
        })
    }

    /**
     * 获取重量价格
     */
    async getWeightPrice(agent_id,weightValue){
        let weights = await this.model('agent_weight_ruls').where({agent_id: agent_id || 0}).order('min_weight asc').select();
        let weightPrice = 0;
        for(let i in weights){
            if(weightValue >= weights[i].min_weight && weightValue < weights[i].max_weight){
                weightPrice = weights[i].price
            }
        }
        return weightPrice
    }

}