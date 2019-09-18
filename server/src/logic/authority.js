const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {

    async listAction() {
    }
    /**
     * 赋予权限
     */
    async giveAction(){
      let rs = await this.checkRules(['array']);
       if(rs.is){
           return this.fail(rs.str)
       }
       if(JSON.parse(this.post('array')).length == 0){
         return this.fail('array不能为空')
       }
    }

    /**
     * 查询赋予的权限
     */
    async ownAction(){
      let rs = await this.checkRules(['role_id']);
      if(rs.is){
          return this.fail(rs.str)
      }
    }

    async delAction(){
      let rs = await this.checkRules(['role_id','array']);
      if(rs.is){
          return this.fail(rs.str)
      }
    }
};
