module.exports = class extends think.Model {
    async checkAuth(role_id,auth_api,type){
        let sql = 'select * from erd_auth_give ag,erd_authority au where ag.role_id='+role_id+' and ag.auth_id=au.id and au.auth_url="'+auth_api+'" and au.auth_type='+type;
        let res = await this.query(sql);
        if(res.length == 0){
            return false
        }else{
            return true
        }
    }
}