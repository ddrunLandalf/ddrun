const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取配置
     */
    async getAction(){
       let rs = await this.checkRules(['config_key']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    /**
     * 更新配置
     */
    async updateAction () {
       let rs = await this.checkRules(['config_key','config_content']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
}