const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 申请成为跑男
     */
    async registerAction(){
        let userInfo = this.post('userInfo');
        let add = await this.model('wxapp_service').thenAdd({
            wx_id:userInfo.id,
            realname:this.post('realname'),
            id_number:this.post('id_number'),
            card_z_img: this.post('card_z_img'),
            card_f_img: this.post('card_f_img'),
            status: 0,
            ws_type:1,
            form_id: this.post('formId')
        },{ wx_id:userInfo.id})
        if(add.type == 'add'){
            return this.success({},'资料提交成功');
        }else{
            return this.fail('资料提交失败');
        }
    }

    /**
     * 修改信息
     */
    async updateAction(){
        let update = await this.model('wxapp_service').where({wx_id:this.post('userInfo').id}).update({
            realname:this.post('realname'),
            id_number:this.post('id_number'),
            card_z_img: this.post('card_z_img'),
            card_f_img: this.post('card_f_img'),
            status: 0,
            form_id: this.post('formId')
        })
        return this.success({},'资料提交成功');
    }

    //查询
    async findAction(){
        let userInfo = this.post('userInfo');
        let res = await this.model('wxapp_service').where({wx_id: userInfo.id}).find();
        if(res.id){
            let dt = await this.model('wxapp_service_verify').where({ws_id: res.id}).order('create_time desc').find();
            res.verify = dt
        }
        return this.success(res,'资料提交成功');
    }

    //订单详情中查找
    async orderfindAction(){
        let res = await this.model('wxapp_service').where({id: this.post('ws_id')})
            .field('id,realname,score,wx_id').find();
        res.realname = res.realname.substring(0,1) + '师傅';
        res.score = res.score.toFixed(1);
        let phone = await this.model('phone').where({user_type:2,user_id:res.wx_id}).find();
        let wx = await this.model('wxapp_user').where({id:res.wx_id}).field('avatar_url').find();
        return this.success({
            service: res,
            phone: phone.phone_number,
            avatar_url: wx.avatar_url
        })
    }

    //更改接单模式
    async modeAction () {
        let userInfo = this.post('userInfo');
        let res = await this.model('wxapp_service').where({wx_id: userInfo.id}).find();
        if(res.id){
            if(res.status == 2){
                let up = await this.model('wxapp_service').where({id:res.id}).update({take_mode:this.post('mode')});
                let name = res.ws_type == 1 ? 'run':'dirve';
                let ors = await this.cache(name+'List');
                if(ors){
                    let temp = -1;
                    for(let i in ors){
                        if(ors[i].id == res.id){
                            temp = i;
                        }
                    }
                    let flag = await this.cache(name+'Flag');
                    if(temp == -1){
                        if(this.post('mode') == 1 || this.post('mode') ==2){
                            ors.push(res)
                        }
                    }else{
                        if(this.post('mode') == 0){
                            ors.splice(temp,1);
                            if(flag && temp >= flag){
                                flag = flag-1;
                                await this.cache(name+'Flag',flag)
                            }
                        }
                    }
                    await this.cache(name+'List',ors);
                }
                return this.success({update:up},'更改状态成功')
            }else{
                return this.fail('状态不允许'); 
            }
        }else{
            return this.fail('您还不是接单员');
        }
    }

    /**
     * 跑男数据
     */
    async anlysisAction () {
        let ws = await this.model('wxapp_service').where({wx_id: this.post('userInfo').id}).find();
        if(!ws.id){
            return this.fail('您不是接单员')
        }
        let comDaily = await this.model('order').orderComDailyData(ws.id);
        let comMonth = await this.model('order').orderComMonthData(ws.id);
        let com = await this.model('order').orderComData(ws.id);
        return this.success({
            comDaily: comDaily[0].total,
            comMonth: comMonth[0].total,
            com: com[0].total
        })
    }

}