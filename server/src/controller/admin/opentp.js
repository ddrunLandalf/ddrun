const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 添加第三方应用
     */
    async addAction () {
        let add = await this.model('opentp_app').add({
            app_key: think.uuid('v4'),
            app_name: this.post('app_name'),
            status: this.post('status'),
            ip_white_list: this.post('ip_white_list'),
            cb_url:this.post('cb_url')
        }) 
        this.success({id:add},'添加应用成功')
    }

    /**
     * 修改应用
     */
    async updateAction(){
        let update = await this.model('opentp_app').where({id:this.post('id')}).update({
            app_name: this.post('app_name'),
            status: this.post('status'),
            ip_white_list: this.post('ip_white_list'),
            cb_url:this.post('cb_url')
        })
        this.success({update},'更新成功')
    }

    /**
     * 删除应用
     */
    async recoverAction(){
        let del = await this.model('opentp_app').where({id: ['in',this.post('ids')]}).update({is_recover:1});
        this.success({del},'删除成功')
    }

    /**
     * 修改状态
     */
    async statusAction(){
        let del = await this.model('opentp_app').where({id: ['in',this.post('ids')]}).update({status:this.post('status')});
        this.success({del},'更新状态成功')
    }

    /**
     * 查询
     */
    async listAction(){
        let whereOptions = {};
        this.post('app_name') ? whereOptions['app_name'] = ['LIKE','%'+this.post('app_name')+'%']:'';
        this.post('app_key') ? whereOptions['app_key']     = ['LIKE','%'+this.post('app_key')+'%']:'';
        this.post('status') !== "" ? whereOptions['status'] = this.post('status'):'';
        whereOptions['is_recover'] = 0;

        let result = await this.model('opentp_app')
            .where(whereOptions)
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }
}