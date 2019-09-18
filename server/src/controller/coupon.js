const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    
    /**
     * 新增优惠券
     */
    async addAction(){
        let add = await this.model('coupon').add({
            coupon_name: this.post('coupon_name'),
            deadline_days: this.post('deadline_days'),
            discount_amount: this.post('discount_amount'),
            conditions_amount: this.post('conditions_amount'),
            condition_service: this.post('condition_service'),
            limit_service:this.post('limit_service'),
            status: this.post('status'),
            limit_no: this.post('limit_no')
        })

        return this.success({id:add},'新增优惠券成功')
    }

    /**
     * 更新优惠券
     */
    async updateAction(){
        let update = await this.model('coupon').where({id:this.post('id')}).update({
            status: this.post('status'),
            limit_no: this.post('limit_no')
        })

        return this.success({},'优惠券更新成功')
    }
    /**
     * 优惠券列表
     */
    async listAction () {
        let whereOptions = {};
        this.post('coupon_name') ? whereOptions['coupon_name'] = ['LIKE','%'+this.post('coupon_name')+'%']:'';
        this.post('status') !== "" ? whereOptions['status'] =this.post('status'):'';
        this.post('limit_service') !== "" ? whereOptions['limit_service'] =this.post('limit_service'):'';
        whereOptions.is_recover = 0;
        let result = await this.model('coupon')
            .where(whereOptions)
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }
    
    /**
     * 回收
     */
    async recoverAction(){
        let result =await this.model('coupon').where({id:['in',this.post('ids')]}).update({is_recover:1});
        return this.success(result,'回收了'+result+'数据');
    }

    /**
     * 发放
     */
    async sendAction () {
        let ids = (await this.post('ids')).split(',');
        let coupon_id = await this.post('coupon_id');
        let coupon = await this.model('coupon').where({id: coupon_id}).find();
        if(!coupon.id){
            return this.fail('优惠券不存在')
        }
        if(coupon.status != 1){
            return this.fail('优惠券不可发放')
        }
        if(coupon.limit_no != -1){
            let sy = parseInt(coupon.limit_no)-parseInt(coupon.cumulative_draw_no);
            if(sy <= 0){
                return this.fail('优惠券发放数量上限')
            }
            if(sy < ids.length){
                return this.fail('您选择的人数超过优惠券发放限制了')
            }
        }
        let addData = [];
        for(let i in ids){
            addData.push({
                coupon_id: coupon_id,
                deadline_time: ['exp', 'date_add(now(), interval '+coupon.deadline_days+' day)'],
                wx_id: ids[i],
                origin_des: '平台赠送'
            })
        }
        let addm = await this.model('wxapp_coupon').addMany(addData);
        return this.success({addm},'发放成功')
    }
}