const BaseRest = require('../wxp/wxpbase');
module.exports = class extends BaseRest {
    async orderAction(){
        this.allowMethods = 'CLI';
    }
    async wxuserAction () {
        this.allowMethods = 'CLI';
    }
}