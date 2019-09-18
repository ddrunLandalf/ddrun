const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    /**
     * 添加银行卡
     */
    async addAction(){
        let rs = await this.checkRules(['account_name','realname','account_number']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }

    /**
     * 修改
     */
    async updateAction () {
        let rs = await this.checkRules(['account_name','realname','account_number','id']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
    
}