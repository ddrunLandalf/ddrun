const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取服务配置
     */
    async getCityAction(){
        let rs = await this.checkRules(['location']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }

    /**
     * 搜索地址
     */
    async searchAction(){
        let rs = await this.checkRules(['keyword','city_name','pageSize','pageIndex']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }

    /**
     * 地址解析
     */
    async  parseAction(){
        
    }
}