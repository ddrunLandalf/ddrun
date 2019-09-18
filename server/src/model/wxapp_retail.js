module.exports = class extends think.Model {
    async team (wx_id,pageIndex,pageSize){
        let sql = 'select wr.*,ph.phone_number from erd_wxapp_retail wr,erd_phone ph where wr.wx_id = ph.user_id and ph.user_type=2 and wr.superior_id='+wx_id + 
         ' order by wr.create_time desc limit '+(pageIndex-1)+','+pageSize;
         return await this.query(sql)
    }
};