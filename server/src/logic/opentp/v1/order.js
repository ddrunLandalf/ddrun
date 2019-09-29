const BaseRest = require('../base.js');
module.exports = class extends BaseRest {

    async placeAction(){
       this.allowMethods = 'post';
       let rs = await this.checkRules(['app_key','startAddress','endAddress','service_type','weight']);
       if(rs.is){
           return this.fail(rs.str)
       }
    }

}