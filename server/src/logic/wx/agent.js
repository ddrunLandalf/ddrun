const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取配置
     */
    async configAction(){
        let rs = await this.checkRules(['city_name']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
}