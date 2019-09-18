const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    async lookAction () {}

    async nouseAction () {}

    async deadlineAction(){}

    /**
     * 会员领取优惠券
     */
    async vipDrawAction () {
        let rs = await this.checkRules(['couponId','dayType']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
}