const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
  
  //管理员登录
  loginAction () {
    let rules = {
      admin_name: {
        string: true,      
        required: true,    
        aliasName:'管理员用户名'
      },
      admin_pwd:{
        string: true, 
        required: true,
        aliasName:'管理员密码'
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('数据校验失败', this.validateErrors);
    }
  }
  //添加管理员
  addAction() {
    
    let rules = {
      admin_name: {
        string: true,      
        required: true,    
        byteLength: {min:4,max: 12},
        aliasName:'管理员用户名'
      },
      admin_pwd:{
        string: true,     
        required: true,
        byteLength: {min:6,max: 14},
        aliasName:'管理员密码'
      },
      role_id: {
        int: true,
        required: true,
        aliasName:'角色'
      },
      telNumber:{
        string: true, 
        required: false,
        byteLength: 11,
        aliasName:'手机号'
      },
      realname:{
        string: true, 
        required: false,
        byteLength: {max:30},
        aliasName:'真实姓名'
      }
    }
    
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('数据校验失败', this.validateErrors);
    }
  }

  

  //更新管理员信息
  async updateMsgAction(){
    let rules = {
      
      tel_number:{
        string: true, 
        required: false,
        byteLength: 11,
        aliasName:'手机号'
      },
      realname:{
        string: true, 
        required: false,
        byteLength: {max:30},
        aliasName:'真实姓名'
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('数据校验失败', this.validateErrors);
    }
  }

  //修改密码
  async updatePwdAction(){
    let rules = {
      old_pwd: {
        string: true,      
        required: true,    
      },
      new_pwd: {
        string: true,      
        required: true,    
      }
    }
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('数据校验失败', this.validateErrors);
    }
  }

  //移入回收站
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
     * 启用或禁用管理员
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
     * 查询管理员列表
     */
  async listAction(){
    let rules = global.commonListRule;
    let flag = this.validate(rules);
    if(!flag){
      return this.fail('数据校验失败', this.validateErrors);
    }
  }

};
