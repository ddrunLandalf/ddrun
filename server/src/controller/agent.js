const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {
    /**
     * 添加代理
     */
    async addAction(){
        let formData = JSON.parse(this.post('formData'));
        let distanceRules = JSON.parse(this.post('distanceRules'));
        let serviceRules = JSON.parse(this.post('serviceRules'));
        let weightRules = JSON.parse(this.post('weightRules'));

        //查询用户是否存在
        let findUser = await this.model('phone').where({phone_number: formData.phone_number,user_type:2}).find();
        if(!findUser.id){
            return this.fail('微信用户不存在，请重新填写手机号')
        }

        //查询该用户是否已经是代理
        let findAgent = await this.model('agent').where({wx_id:findUser.user_id}).find();
        if(findAgent.id){
            return this.fail('该用户已是'+findAgent.city_name+'的代理')
        }

        //添加代理
        let agentAdd = await this.model('agent').thenAdd({
            city_name: formData.city_name,
            is_serve: formData.is_serve,
            realname: formData.realname,
            cross_city_service: formData.cross_city_service,
            wx_id:findUser.user_id
        },{city_name: formData.city_name});
        if(agentAdd.type=='exist'){
            return this.fail('该城市已存在代理')
        }
        await this.model('agent_change_log').add({
            agent_id:agentAdd.id,
            wx_id:findUser.user_id,
            realname: formData.realname
        })
        //添加服务收益规则
        
        for(let i in serviceRules){
            delete serviceRules[i].inputVisible;
            delete serviceRules[i].inputValue;
            serviceRules[i].agent_id = agentAdd.id;
            serviceRules[i].des_tags = serviceRules[i].des_tags.toString()
        }
        let serviceAdd = await this.model('agent_service').addMany(serviceRules);
        if(serviceAdd.length < 4){
            return this.fail('服务收益规则没有填写完整')
        }

        //添加路程计算规则
        for(let i in distanceRules){
            distanceRules[i].agent_id = agentAdd.id;
        }
        let distanceAdd = await this.model('agent_distance_rules').addMany(distanceRules);
        if(distanceAdd.length < 4){
            return this.fail('路程计算规则没有填写完整')
        }

        //重量计算规则
        for(let i in weightRules){
            weightRules[i].agent_id = agentAdd.id;
        }
        let weightAdd =  await this.model('agent_weight_ruls').addMany(weightRules);
        
        return this.success({id:agentAdd.id},'添加成功')
    }

    /**获取代理列表 */
    async listAction () {
        let whereOptions = {};
        this.post('realname') ? whereOptions['erd_agent.realname']   = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('city_name') ? whereOptions['erd_agent.city_name'] = ['LIKE','%'+this.post('city_name')+'%']:'';
        this.post('is_serve') !== "" ? whereOptions['erd_agent.is_serve'] = this.post('is_serve'):'';
        this.post('cross_city_service') !== "" ? whereOptions['erd_agent.cross_city_service'] = this.post('cross_city_service'):'';
        whereOptions['erd_agent.is_recover'] = 0;

        let result = await this.model('agent')
            .where(whereOptions)
            .order(this.post('sorts'))
            .field("erd_agent.*,(select phone_number from erd_phone where user_type=2 and user_id = wx_id) as phone_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }
    /**获取全国 */
    async findAction(){
        let agent = await this.model('agent').where({city_name:'全国'}).find();
        return this.success(agent)
    }

    /**
     * 启用或禁用城市服务
     */
    async serveAction () {
        let result =await this.model('agent').where({id:['in',this.post('ids')]}).update({is_serve:this.post('is_serve')});
        return this.success(result,'修改了'+result+'数据');
    }

    /**
     * 启用或禁用跨城服务
     */
    async crossAction(){
        let result =await this.model('agent').where({id:['in',this.post('ids')]}).update({cross_city_service:this.post('cross_city_service')});
        return this.success(result,'修改了'+result+'数据');
    }

    /**
     * 回收
     */
    async recoverAction(){
        let result =await this.model('agent').where({id:['in',this.post('ids')]}).update({is_recover:this.post('is_recover')});
        return this.success(result,'修改了'+result+'数据');
    }

    /**
     * 更换代理
     */
    async changeAgentAction(){
        //查询用户是否存在
        let findUser = await this.model('phone').where({phone_number: this.post('phone_number'),user_type:2}).find();
        if(!findUser.id){
            return this.fail('微信用户不存在，请重新填写手机号')
        }

        //查询该用户是否已经是代理
        let findAgent = await this.model('agent').where({wx_id:findUser.user_id}).find();
        if(findAgent.id){
            return this.fail('该用户已是'+findAgent.city_name+'的代理')
        }

        let update = await this.model('agent').where({id:this.post('id')}).update({
            wx_id: findUser.user_id,
            realname: this.post('realname')
        });

        if(update > 0){
            await this.model('agent_change_log').add({
                agent_id:this.post('id'),
                wx_id:findUser.user_id,
                realname: this.post('realname')
            })
            return this.success({},'更新成功')
        }else{
            return this.fail('更新失败')
        }
    }

    /**
     * 获取代理信息
     */
    async msgAction () {
        return this.success({
            distanceRules: await this.model('agent_distance_rules').where({agent_id:this.post('id') || '0'}).select(),
            serviceRules: await this.model('agent_service').where({agent_id:this.post('id') || '0'}).select(),
            weightRules: await this.model('agent_weight_ruls').where({agent_id:this.post('id') || '0',is_recover:0}).select()
        },'success')
    }

    /**
     * 更新服务
     */
    async updateServiceAction(){
        let serviceRules = JSON.parse(this.post('serviceRules'));
        for(let i in serviceRules){
            delete serviceRules[i].inputVisible;
            delete serviceRules[i].inputValue;
            serviceRules[i].des_tags = serviceRules[i].des_tags.toString()
        }
        let service = await this.model('agent_service').updateMany(serviceRules);
        return this.success(service,'更新成功')
    }

    /**
     * 更新路程
     */
    async updateDistanceAction(){
        let distanceRules = JSON.parse(this.post('distanceRules'));
        let distance = await this.model('agent_distance_rules').updateMany(distanceRules);
        return this.success(distance,'更新成功')
    }

    /**
     * 更新重量
     */
    async updateWeightAction(){
        let weightRules = JSON.parse(this.post('weightRules'));
        console.log(weightRules)
        let weight = await this.model('agent_weight_ruls').updateMany(weightRules);
        return this.success(weight,'更新成功')
    }

    /**
     * 回收重量
     */
    async recoverWeightAction(){
        let result =await this.model('agent_weight_ruls').where({id:['in',this.post('ids')]}).update({is_recover:1});
        return this.success(result,'修改了'+result+'数据');
    }

    /**
     * 新增重量
     */
    async newWeightAction(){
        let result = await this.model('agent_weight_ruls').add({
            agent_id:this.post('id')
        })
        return this.success({id:result},'添加成功');
    }

    
    
}