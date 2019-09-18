const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    
    //审核列表
    async listAction () {
        let whereOptions = {};
        this.post('phone_number') ? whereOptions['erd_phone.phone_number'] = ['LIKE','%'+this.post('phone_number')+'%']:'';
        this.post('id_number') ? whereOptions['erd_wxapp_service.id_number'] = ['LIKE','%'+this.post('id_number')+'%']:'';
        this.post('realname') ? whereOptions['erd_wxapp_service.realname']     = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('status') !== "" ? whereOptions['erd_wxapp_service.status'] = this.post('status'):'';
        whereOptions['erd_phone.user_type'] = 2;
        whereOptions['erd_wxapp_service.status'] = ['IN','0,1'];

        let result = await this.model('wxapp_service').join({ table: 'phone',  join: 'left', on: ['wx_id', 'user_id'] })
            .where(whereOptions)
            .order(this.post('sorts'))
            .group('erd_wxapp_service.id')
            .field("erd_wxapp_service.*,erd_phone.phone_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        let count = await this.model('wxapp_service').where({status:['IN','0,1']}).count();
        result.count = count || 0;
        return this.success(result)
    }

    //操作
    async handleAction () {
        let status = this.post('status');
        
        await this.model('wxapp_service').where({id:this.post('id')}).update({
            status: status,
            start_date: this.post('start_date'),
            end_date: this.post('end_date')
        })
         await this.model('wxapp_service_verify').add({
            ws_id: this.post('id'),
            status: status,
            refuse_des: this.post('refuse_msg') || ''
        })

        /**发送模板消息 */
        let re = await this.model('wxapp_service').where({id:this.post('id')}).find();
        let wx = await this.model('wxapp_user').where({id:re.wx_id}).find()
        let appConfig = JSON.parse((await this.getSysConfig('mwx_id_key')).config_content)
        await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',wx.openid,await this.getWxappTemplateId('AT0146'),re.form_id,'/pages/runman/status/status',{
            keyword1: {value: this.post('start_date') == 1 ? '拒绝':'通过审核'},
            keyword2: {value: this.post('refuse_msg') || ''},
        })
        /**发送模板消息 */

        return this.success({},'操作成功')
    }

    //操作日志
    async logAction () {
        let whereOptions = {};
        this.post('id_number') ? whereOptions['erd_wxapp_service.id_number'] = ['LIKE','%'+this.post('id_number')+'%']:'';
        this.post('realname') ? whereOptions['erd_wxapp_service.realname']     = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('status') !== "" ? whereOptions['erd_wxapp_service_verify.status'] = ['IN',this.post('status')]:'';

        let result = await this.model('wxapp_service_verify').join({ table: 'wxapp_service',  join: 'left', on: ['ws_id', 'id'] })
            .where(whereOptions)
            .order(this.post('sorts'))
            .group('erd_wxapp_service_verify.id')
            .field("erd_wxapp_service_verify.*,erd_wxapp_service.realname,erd_wxapp_service.id_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        let count = await this.model('wxapp_service_verify').where({status: ['IN',this.post('status')]}).count();
        result.count = count;
        return this.success(result)
    }


}