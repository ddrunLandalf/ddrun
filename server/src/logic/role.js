const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
  
    /**
     * 新增角色
     */
    async addAction () {
        let rules = {
            role_name: {
              string: true,      
              required: true,    
              aliasName:'角色名称'
            },
            status:{
              int: true, 
              required: true,
              aliasName:'状态'
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('数据校验失败', this.validateErrors);
        }
    }

    /**
     * 修改角色
     */
    async updateAction () {
        let rules = {
            id: {
                int: true,      
                required: true,    
                aliasName:'ID'
            },
            role_name: {
              string: true,      
              required: true,    
              aliasName:'角色名称'
            },
            status:{
              int: true, 
              required: true,
              aliasName:'状态'
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('数据校验失败', this.validateErrors);
        }
    }

    /**
     * 移入回收站
     */
    async recoverAction () {
        let rules = {
            ids: {
              string: true,      
              required: true,    
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('数据校验失败', this.validateErrors);
        }
    }

    /**
     * 启用或禁用角色
     */
    async statusAction () {
        let rules = {
            ids: {
              string: true,      
              required: true,    
            },
            status:{
              int: true,      
              required: true,
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('数据校验失败', this.validateErrors);
        }
    }

    /**
     * 查询列表
     */
    async listAction () {
        let rules = global.commonListRule;
        let flag = this.validate(rules);
        if(!flag){
        return this.fail('数据校验失败', this.validateErrors);
        }
    }
}