const BaseRest = require('./rest.js');
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs);
module.exports = class extends BaseRest {
    async certAction (){
        const file = this.file('file');
        let fileName = think.uuid('v4');
        let gs = file.name.substring(file.name.lastIndexOf('.')+1,file.name.length)
        const filepath = path.join(think.ROOT_PATH, 'runtime/cert/'+fileName+'.'+gs);
        think.mkdir(path.dirname(filepath));
        await rename(file.path, filepath)
        return this.success({url:'runtime/cert/'+fileName+'.'+gs})
    }

    async imgAction (){
        const file = this.file('file');
        let fileName = think.uuid('v4');
        let gs = file.name.substring(file.name.lastIndexOf('.')+1,file.name.length)
        const filepath = path.join(think.ROOT_PATH, 'www/static/upload/'+fileName+'.'+gs);
        think.mkdir(path.dirname(filepath));
        await rename(file.path, filepath)
        return this.success({url:'static/upload/'+fileName+'.'+gs})
    }

}