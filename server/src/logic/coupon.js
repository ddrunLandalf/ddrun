const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    /**
     * 新增优惠券
     */
    async addAction(){
        let rs = await this.checkRules(['coupon_name','deadline_days','discount_amount','status','limit_no']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async updateAction () {
        let rs = await this.checkRules(['status','limit_no','id']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async listAction(){
        let rs = await this.checkRules(['currentPage','pageSize']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async recoverAction(){
        let rs = await this.checkRules(['ids']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async sendAction () {
        let rs = await this.checkRules(['ids']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
}