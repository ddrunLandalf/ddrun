module.exports = class extends think.Model {

    async getOverview(){
        let sql = 'select a._date,a._day,'+
        'ifnull(b.user_total,0) as user_total,'+
        'ifnull(b.regist_total,0) as regist_total,'+
        'ifnull(b.growth,0) as growth '+
        'from ( '+
            "SELECT DATE_FORMAT(date_sub(now(), interval 1 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 1 day),'%d') as _day "+
            'union all '+
            "SELECT DATE_FORMAT(date_sub(now(), interval 2 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 2 day),'%d') as _day "+
            "union all "+
            "SELECT DATE_FORMAT(date_sub(now(), interval 3 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 3 day),'%d') as _day "+
            "union all "+
            "SELECT DATE_FORMAT(date_sub(now(), interval 4 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 4 day),'%d') as _day "+
            "union all "+
            "SELECT DATE_FORMAT(date_sub(now(), interval 5 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 5 day),'%d') as _day "+
            "union all "+
            "SELECT DATE_FORMAT(date_sub(now(), interval 6 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 6 day),'%d') as _day "+
            "union all "+
            "SELECT DATE_FORMAT(date_sub(now(), interval 7 day),'%Y-%m-%d') as _date, DATE_FORMAT(date_sub(now(), interval 7 day),'%d') as _day "+
        ") as a "+
        "left join erd_anlysis_wxuser as b "+
        "on a._date = DATE_FORMAT(b.data_time,'%Y-%m-%d') order by a._date asc";
        let res = this.query(sql);
        return res
    }
}