const BaseRest = require('./wxpbase.js');

module.exports = class extends BaseRest {
    async devAction(){
        this.allowMethods = 'get,post';
    }
}