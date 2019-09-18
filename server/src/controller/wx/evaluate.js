const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    async addAction () {
        let add = await this.model('order_evaluate').thenAdd({
            order_id: this.post('order_id'),
            ws_id: this.post('ws_id'),
            score: this.post('score'),
            oe_type:1,
            msg: this.post('msg')
        },{
            order_id: this.post('order_id')
        })
        if(add.type == 'exist'){
            return this.fail('该订单已存在')
        }else{
            return this.success({},'评价成功')
        }
    }

    async findAction () {
        let find = await this.model('order_evaluate').where({order_id: this.post('order_id')}).find();
        return this.success(find)
    }

    async listAction () {
        let ws = await this.model('wxapp_service').where({wx_id : this.post('userInfo').id}).find();
        if(!ws.id){
            return this.fail('您不是跑腿的')
        }
        let result = await this.model('order_evaluate')
            .where({
                ws_id: ws.id
            })
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)   
    }
}