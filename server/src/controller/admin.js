const BaseRest = require('./rest.js');
const jwt = require('jsonwebtoken');
module.exports = class extends BaseRest {

    /**
     * 管理员登录
     */
    async loginAction () {
        const adminName =this.post('admin_name');  //管理员登录名*
        const adminPwd  =  global.md5(this.post('admin_pwd'));   //管理员密码*
        let model = this.model('admin');
        let result = await model.findAdminByAdminNameAndPwd(adminName,adminPwd);
        if(result.id){
            let token = jwt.sign({
                user_id: result.id,
                type: 1
            }, global.jwtSecret, { expiresIn: '2h' });
            return this.success({
                token:token,
                userInfo: result
            },'登录成功')
        }else{
            return this.fail('用户名或密码不正确',result)
        }
    }
    
    /**
     * 新增管理员 (打星号为必填字段)
     */
    async addAction () {
        const adminName = this.post('admin_name');  //管理员登录名*
        const adminPwd  = this.post('admin_pwd');   //管理员密码*
        const telNumber = this.post('tel_number');  //手机号
        const realname  = this.post('realname');    //真实姓名
        const role_id   = this.post('role_id');     //角色ID*
        let model = this.model('admin');
        let result = await model.addAdmin(
            adminName,global.md5(adminPwd),telNumber,realname,role_id,this.post('userInfo').id
        )
        if(result.type == 'exist'){
            return this.fail('账号已存在',result)
        }else{
            return this.success(result,'添加管理员成功')
        }
    }
    /**
     * 修改管理管信息
     */
    async updateMsgAction () {
        const telNumber = this.post('tel_number');  //手机号
        const realname  = this.post('realname');    //真实姓名
        const role_id   = this.post('role_id');     //角色ID*
        const id =this.post('id') || this.post('userInfo').id;
        let model = this.model('admin');
        let result = await model.updateMsg(telNumber,realname,role_id,id);
        if(result == 1){
            return this.success(result,'修改成功')
        }else{
            return this.fail('修改失败',result)
        }
    }

    /**
     * 修改密码
     */
    async updatePwdAction () {
        const oldPwd = this.post('old_pwd');
        const newPwd = this.post('new_pwd');
        const id = this.post('userInfo').id;
        let model = this.model('admin');
        let result = await model.findAdminByIdAndOldPwd(global.md5(oldPwd),id);
        if(result.id){
            let update = await model.updatePwd(global.md5(newPwd),id)
            if(update == 1){
                return this.success({},'修改密码成功')
            }else{
                return this.fail('修改密码失败',result)
            }
        }else{
            return this.fail('旧密码错误',result)
        }
    } 

    /**
     * 移入回收站
     */
    async recoverAction () {
        let ids = this.post('ids').split(',');
        let arr = [];
        let recArr = [];
        let temp = -1;
        for(let i in ids){
            arr.push({id:ids[i],is_recover:1});
            recArr.push({rec_type:'管理员',rec_des:'ID为'+ids[i]+'的管理员',from_table:'admin',key_id:ids[i]})
            if(parseInt(ids[i]) === parseInt(this.post('userInfo').id) || parseInt(ids[i]) === global.superAdmin){
                temp = i;
                break;
              }
        }

        if(temp != -1){
            return this.fail('无法删除自己或超级管理员');
        }

        let result =await this.model('admin').updateMany(arr);
        
        await this.model('recover').addMany(recArr);

        return this.success(result,'删除了'+result.length+'数据');
    }

    /**
     * 启用或禁用管理员
     */
    async statusAction () {
        let ids = this.post('ids').split(',');
        let arr = [];
        let temp = -1;
        for(let i in ids){
            arr.push({id:ids[i],status:this.post('status')})
            
            if(parseInt(ids[i]) === parseInt(this.post('userInfo').id) || parseInt(ids[i]) === global.superAdmin){
                temp = i;
                break;
              }
        }
        if(temp != -1){
            return this.fail('无法修改自己或超级管理员的状态');
        }
        let result =await this.model('admin').updateMany(arr);
        
        return this.success(result,'修改了'+result.length+'数据');
    }

    /**
     * 查询管理员列表
     * @param {*} admin_name
     * @param {*} role_name
     * @param {*} tel_number
     * @param {*} realname
     * @param {*} sorts
     * @param {*} currentPage
     * @param {*} pageSize
     */
    async listAction () {
        let whereOptions = {};
        this.post('admin_name') ? whereOptions['erd_admin.admin_name'] = ['LIKE','%'+this.post('admin_name')+'%']:'';
        this.post('role_name') ? whereOptions['erd_role.role_name']   = ['LIKE','%'+this.post('role_name')+'%']:'';
        this.post('tel_number') ? whereOptions['erd_admin.tel_number'] = ['LIKE','%'+this.post('tel_number')+'%']:'';
        this.post('realname') ? whereOptions['erd_admin.realname']     = ['LIKE','%'+this.post('realname')+'%']:'';
        this.post('status') !== "" ? whereOptions['erd_admin.status'] = this.post('status'):'';
        whereOptions['erd_admin.is_recover'] = 0;

        let result = await this.model('admin').join({ table: 'role',  join: 'left', on: ['role_id', 'id'] })
            .where(whereOptions)
            .order(this.post('sorts'))
            .group('erd_admin.id')
            .field("erd_admin.*,erd_role.role_name")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

};
