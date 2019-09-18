const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    /**
     * 添加银行卡
     */
    async addAction(){
        let add = await this.model('cash_account').add({
            user_type: 1,
            user_id: this.post('userInfo').id,
            account_name: this.post('account_name'),
            realname: this.post('realname'),
            account_number: this.post('account_number')
        })
        return this.success({id:add},'添加银行卡成功')
    }

    /**
     * 修改
     */
    async updateAction () {
        let update = await this.model('cash_account').where({id: this.post('id')}).update({
            account_name: this.post('account_name'),
            realname: this.post('realname'),
            account_number: this.post('account_number')
        })
        return this.success({eff:update},'更新银行卡成功')
    }

    /**
     * 删除回收
     */
    async recoverAction () {
        let update = await this.model('cash_account').where({id: this.post('id')}).update({
            is_recover: 1,
        })
        return this.success({eff:update},'删除成功')
    }

    /**
     * 账户列表
     */
    async listAction () {
        let result = await this.model('cash_account')
            .where({
                user_type: 1,
                user_id: this.post('userInfo').id,
                is_recover: 0
            })
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

}