const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 计算价格
     */
    async calculationAction () {
        let rs = await this.checkRules(['startAddress','endAddress','service_type']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
}