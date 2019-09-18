const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {
    /**
     * 获取配置
     */
    async getAction(){
        return this.success(await this.getSysConfig(this.post('config_key')))
    }

    /**
     * 更新配置
     */
    async updateAction () {
        let check = await this.model('config').where({config_key:this.post('config_key')}).find();
        if(!check.id){
            let add = await this.model('config').add({
                config_key: this.post('config_key'),
                config_content: this.post('config_content')
            })
            if(add != 0){
                await this.cache(this.post('config_key'),{config_content:this.post('config_content')});
                return this.success(0,'更新配置成功')
            }else{
                return this.fail(1000,'更新配置失败')
            }
        }else{
            let update = await this.model('config')
                .where({config_key:this.post('config_key')})
                .update({config_content:this.post('config_content'),update_time: new Date()})
            if(update>0){
                await this.cache(this.post('config_key'),{config_content:this.post('config_content')});
                return this.success(0,'更新配置成功')
            }else{
                return this.fail(1000,'更新配置失败')
            }
        }
    }
}