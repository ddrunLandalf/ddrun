const BaseRest = require('../rest.js');
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs);
module.exports = class extends BaseRest {

    //上传图片
    async uploadCardAction (){
        const file = this.file('image');
        if(file && (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')){
            let fileName = think.uuid('v4');
            let gs = file.type.substring(6,file.type.length)
            const filepath = path.join(think.ROOT_PATH, 'www/static/card/'+fileName+'.'+gs);
            think.mkdir(path.dirname(filepath));
            await rename(file.path, filepath)
            return this.success({url:'static/card/'+fileName+'.'+gs})
        }else{
            this.fail('请上传png或jpg格式的图片')
        }
    }

}