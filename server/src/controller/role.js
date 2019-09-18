const BaseRest = require('./rest.js');
module.exports = class extends BaseRest {

    /**
     * 新增角色
     */
    async addAction () {

        let result   = this.model('role').thenAdd({
            role_name: this.post('role_name'),
              remarks: this.post('remarks'),
               status: this.post('status'),
                 sort: this.post('sort'),
           by_user_id: this.post('userInfo').id
        }, {role_name: this.post('role_name')});
        if(result.type == 'exist'){
            return this.fail('角色已存在',result)
        }else{
            return this.success(result,'添加角色成功')
        }

    }

    /**
     * 修改角色
     */
    async updateAction () {
        let result = await this.model('role').where({id: this.post('id')})
            .update({
                role_name: this.post('role_name'),
                  remarks: this.post('remarks'),
                   status: this.post('status'),
                     sort: this.post('sort'),
            });
        if(result == 1){
            return this.success(result,'修改成功')
        }else{
            return this.fail('修改失败',result)
        }
    }

    /**
     * 移入回收站
     */
    async recoverAction () {
        let ids = this.post('ids').split(',');
        let arr = [];
        let recArr = [];
        for(let i in ids){
            arr.push({id:ids[i],is_recover:1});
            recArr.push({rec_type:'角色',rec_des:'ID为'+ids[i]+'的角色',from_table:'role',key_id:ids[i]})
        }

        let result =await this.model('role').updateMany(arr);
        
        await this.model('recover').addMany(recArr);

        return this.success(result,'删除了'+result.length+'数据');
    }

    /**
     * 启用或禁用角色
     */
    async statusAction () {
        let ids = this.post('ids').split(',');
        let arr = [];
        for(let i in ids){
            arr.push({id:ids[i],status:this.post('status')})
        }
        
        let result =await this.model('role').updateMany(arr);
        
        return this.success(result,'修改了'+result.length+'数据');
    }

    /**
     * 查询列表
     */
    async listAction () {
        let whereOptions = {};
        this.post('role_name') ? whereOptions['role_name'] = ['LIKE','%'+this.post('role_name')+'%']:'';
        this.post('remarks') ? whereOptions['remarks']   = ['LIKE','%'+this.post('remarks')+'%']:'';
        this.post('id') ? whereOptions['id'] = ['LIKE','%'+this.post('id')+'%']:'';
        this.post('status') !== "" ? whereOptions['status'] =this.post('status'):'';
        whereOptions['is_recover'] = 0;

        let result = await this.model('role')
            .where(whereOptions)
            .order('sort asc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }
}