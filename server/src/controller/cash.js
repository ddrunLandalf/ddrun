const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    
    /**
     * 审核列表 
     */
    async listAction(){
        let whereOptions = {};
        this.post('account_number') ? whereOptions['erd_cash_account.account_number'] = ['LIKE','%'+this.post('account_number')+'%']:'';
        this.post('realname') ? whereOptions['erd_cash_account.realname']     = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('status') !== "" ? whereOptions['erd_cash.status'] = this.post('status'):'';

        let result = await this.model('cash').join({ table: 'cash_account',  join: 'left', on: ['account_id', 'id'] })
            .where(whereOptions)
            .order('erd_cash.status asc,erd_cash.create_time desc')
            .group('erd_cash.id')
            .field("erd_cash.*,erd_cash_account.account_name,erd_cash_account.realname,erd_cash_account.account_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        let count = await this.model('cash').count();
        result.count = count;
        return this.success(result)
    }

    /**
     * 审核操作
     */
    async verifyAction() {
        let cash = await this.model('cash').where({id: this.post('id')}).find();
        if(!cash.id){ return this.fail('不存在')}
        if(cash.status != 0){ return this.fail('已审核')}
        let status = this.post('status');
        if(status == 1){
            await this.model('cash').where({
                id: this.post('id'),
            }).update({status: status})
            if(cash.user_type == 1){
                await this.model('wxapp_user').where({
                    id: cash.user_id,
                }).update({
                    grand_cash: ['exp','grand_cash+'+cash.cash_amount]
                })
            }else if(cash.user_type == 2) {
                await this.model('wxapp_service').where({
                    id: cash.user_id,
                }).update({
                    cash_amount: ['exp','cash_amount+'+cash.cash_amount]
                })
            }else if( cash.user_type == 3){
                await this.model('agent').where({
                    id: cash.user_id,
                }).update({
                    cash_amount: ['exp','cash_amount+'+cash.cash_amount]
                })
            }
        }else {
            await this.model('cash').where({
                id: this.post('id'),
            }).update({
                status: status,
                status_season: this.post('refuse_msg')
            })
            if(cash.user_type == 1){
                await this.model('wxapp_user').where({
                    id: cash.user_id,
                }).update({
                    surplus_amount: ['exp','surplus_amount+'+cash.cash_amount]
                })
            }else if(cash.user_type == 2) {
                await this.model('wxapp_service').where({
                    id: cash.user_id,
                }).update({
                    surplus_amount: ['exp','surplus_amount+'+cash.cash_amount]
                })
            }else if( cash.user_type == 3){
                await this.model('agent').where({
                    id: cash.user_id,
                }).update({
                    surplus_amount: ['exp','surplus_amount+'+cash.cash_amount]
                })
            }
        }
        return this.success({},'操作成功')
    }

}