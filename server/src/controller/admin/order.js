const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    async listAction(){
        let whereOptions = { }
        this.post('order_no') ? whereOptions['order_no'] = ['LIKE','%'+this.post('order_no')+'%']:'';
        this.post('start_address') ? whereOptions['start_address'] = ['LIKE','%'+this.post('start_address')+'%']:'';
        this.post('end_address') ? whereOptions['end_address'] = ['LIKE','%'+this.post('end_address')+'%']:'';
        this.post('create_time') ? whereOptions['create_time'] = ['LIKE','%'+this.post('create_time')+'%']:'';
        this.post('status') ? whereOptions['status'] = this.post('status'):'';
        this.post('service_type') ? whereOptions['service_type'] = this.post('service_type'):'';

        let res = await this.model('v_order_list')
        .where(whereOptions)
        .page(this.post('currentPage'),this.post('pageSize')).countSelect();
        return this.success(res)
    }
}