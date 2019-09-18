const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

    async addAction(){
       let rs = await this.checkRules(['formData','distanceRules','serviceRules','weightRules']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }

    /**获取代理列表 */
    async listAction () {
        let rules = global.commonListRule;
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('数据校验失败', this.validateErrors);
        }
    }

    /**
     * 启用或禁用城市服务
     */
    async serveAction () {
       let rs = await this.checkRules(['ids']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }

    /**
     * 启用或禁用跨城服务
     */
    async crossAction(){
       let rs = await this.checkRules(['ids']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }

    /**
     * 回收
     */
    async recoverAction(){
        let rs = await this.checkRules(['ids']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    /**
     * 更换代理
     */
    async changeAgentAction(){
        let rs = await this.checkRules(['phone_number','realname']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async findAction(){}
    /**
     * 获取代理信息
     */
    async msgAction () {
        
    }
    async updateServiceAction(){
        let rs = await this.checkRules(['serviceRules']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    async updateDistanceAction(){
        let rs = await this.checkRules(['distanceRules']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }
    /**
     * 更新重量
     */
    async updateWeightAction(){
        let rs = await this.checkRules(['weightRules']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }

    /**
     * 回收重量
     */
    async recoverWeightAction(){
       
    }

    /**
     * 新增重量
     */
    async newWeightAction(){
       
    }
}