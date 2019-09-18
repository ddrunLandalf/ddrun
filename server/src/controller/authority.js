const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {

    /**
     * 查询权限列表
     */
    async listAction(){
        let authList = await this.cache('authList');
        if(authList){
            return this.success(authList)
        }else{
            let result = await this.model('authority_category').order('sort asc').select();
            await this.cache('authList', result ,{
                timeout:7*24*60*60*1000
            });
            return this.success(result)
        }
    }

    /**
     * 赋予权限
     */
    async giveAction(){
        let array = JSON.parse(this.post('array'))
        let result = await this.model('auth_give').addMany(array);
        if(result){
            return this.success(result,'赋予权限成功')
        }else{
            return this.fail('赋予权限失败',result)
        }
    }

    /**
     * 查询拥有的权限
     */
    async ownAction(){

        let list = await this.model('auth_give')
            .where('role_id='+this.post('role_id'))
            .field("auth_id as id,id as ag_id,(select erd_authority.auth_name from erd_authority where id=erd_auth_give.auth_id) as name").select()

        return this.success(list)
    }

    /**
     * 删除权限
     */
    async delAction(){
        let result = await this.model('auth_give').where({auth_id: ['in', this.post('array')],role_id:this.post('role_id')}).delete();
        if(result){
            return this.success(result,'更新权限成功')
        }else{
            return this.fail('更新权限失败',result)
        }
    }
};
