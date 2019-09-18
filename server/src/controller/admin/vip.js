const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    async orderAction () {
        // let whereOptions = {};
        // this.post('tel_number') ? whereOptions['erd_admin.tel_number'] = ['LIKE','%'+this.post('tel_number')+'%']:'';
        // this.post('status') !== "" ? whereOptions['erd_admin.status'] = this.post('status'):'';
        // whereOptions['erd_admin.is_recover'] = 0;

        // let result = await this.model('admin').join({ table: 'role',  join: 'left', on: ['role_id', 'id'] })
        //     .where(whereOptions)
        //     .order(this.post('sorts'))
        //     .group('erd_admin.id')
        //     .field("erd_admin.*,erd_role.role_name")
        //     .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        // return this.success(result)
    }
}