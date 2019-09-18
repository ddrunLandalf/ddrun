
module.exports = class extends think.Model {
    /**
     * 新增管理员
     * @param {string} admin_name 
     * @param {md5} admin_pwd 
     * @param {string} tel_number 
     * @param {string} realname 
     * @param {int} role_id 
     */
    async addAdmin (admin_name,admin_pwd,tel_number,realname,role_id,by_user_id) {
        let model = this.model('admin');
        let result = await model.thenAdd({admin_name: admin_name, admin_pwd: admin_pwd,status:1,tel_number,realname,role_id,by_user_id}, {admin_name: admin_name});
        return result
    }
    /**
     * 根据管理员账号和密码查询数据
     * @param {string} admin_name 
     * @param {md5} admin_pwd 
     */
    async findAdminByAdminNameAndPwd (admin_name,admin_pwd) {
        let model = this.model('admin');
        let result = await model.where({admin_name: admin_name,admin_pwd:admin_pwd}).find();
        return result
    }

    /**
     *更新用户信息 
     * @param {string} tel_number 
     * @param {string} realname 
     * @param {int} role_id 
     * @param {int} id
     */
    async updateMsg (tel_number,realname,role_id,id){
        let model = this.model('admin');
        let result = await model.where({id: id}).update({tel_number: tel_number,realname:realname,role_id:role_id});
        return result
    }

    /**
     * 根据ID和密码查找用户
     * @param {*} pwd 
     * @param {*} id 
     */
    async findAdminByIdAndOldPwd (pwd,id) {
        let model = this.model('admin');
        let result = await model.where({admin_pwd: pwd,id:id}).find();
        return result
    }

    /**
     * 根据ID修改密码
     * @param {*} pwd 
     * @param {*} id 
     */
    async updatePwd(pwd,id){
        let model = this.model('admin');
        let result = await model.where({id: id}).update({admin_pwd: pwd});
        return result
    }
};
