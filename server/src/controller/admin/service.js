const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取跑男列表
     */
    async listAction(){
        let whereOptions = {};
        this.post('id_number') ? whereOptions['id_number'] = ['LIKE','%'+this.post('id_number')+'%']:'';
        this.post('realname') ? whereOptions['realname']     = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('status') !== "" ? whereOptions['status'] = ['IN',this.post('status')]:'';
        whereOptions['ws_type'] = this.post('ws_type');

        let result = await this.model('wxapp_service')
            .where(whereOptions)
            .order('create_time')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

    /**
     * 更新状态
     */
    async statusAction(){
        let update = await this.model('wxapp_service').where({
            id: this.post('id'),
        }).update({
            status: this.post('status')
        })
        return this.success({},'更新成功')
    }

    /**
     * 更新提醒
     */
    async noticeAction(){
        let update = await this.model('wxapp_service').where({
            id: this.post('id'),
        }).update({
            is_notice: this.post('is_notice')
        })
        return this.success({},'更新成功')
    }

    /**
     * 新增驾驶员
     */
    async addAction(){
        let wx_id = this.post('wx_id');
        let isExist = await this.model('wxapp_service').where({
            wx_id: wx_id,
        }).find();
        if(isExist.id){
            return this.fail('该用户已经申请过了')
        }
        let add = this.model('wxapp_service').add({
            wx_id: wx_id,
            realname: this.post('realname'),
            id_number: this.post('id_number'),
            start_date: this.post('start_date'),
            end_date: this.post('end_date'),
            status: 2,
            ws_type: 2
        })
        return this.success({id:add},'添加成功')
    }
}