const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    async addAction () {
        let rs = await this.checkRules(['score','order_id','ws_id']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
    async findAction () {
        let rs = await this.checkRules(['order_id']);
        if(rs.is){
           return this.fail(rs.str)
        }
    }
    async listAction () {
        
    }
}