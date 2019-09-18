const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取配置
     */
    async configAction(){
        let agent = await this.model('agent').where({city_name: '全国'}).find();
        if(!agent.city_name || agent.is_recover == 1){
            return this.fail(this.post('city_name')+'还没有开通服务哦')
        }
        if(agent.is_serve == 0){
            return this.fail(101,this.post('city_name')+'服务已暂停')
        }
        let service = await this.model('agent_service').where({agent_id: 0 }).select();
        let distance = await this.model('agent_distance_rules').where({agent_id: 0 }).select();
        let weight = await this.model('agent_weight_ruls').where({agent_id: 0 ,is_recover:0}).select();

        return this.success({
            agent: agent,
            service: service,
            distance: distance,
            weight: weight
        })
    }

    /**
     * 获取代理信息
     */
    async infoAction(){
        let agent = await this.model('agent').where({wx_id: this.post('userInfo').id}).find();
        return this.success(agent)
    }

    /**
     * 获取代理数据
     */
    async anlysisAction () {
        let agent = await this.model('agent').where({wx_id: this.post('userInfo').id}).find();
        let comDaily = await this.model('order').agentDailyData(agent.city_name);
        let comMonth = await this.model('order').agentMonthData(agent.city_name);
        let com = await this.model('order').agentDailyData(agent.city_name);
        return this.success({
            comDaily: comDaily[0].total,
            comMonth: comMonth[0].total,
            com: com[0].total
        })
    }

    async allWeightAction(){
        let result = await this.model('agent_weight_ruls').where({
            agent_id:0,
        }).select()
        return this.success(result);
    }
}