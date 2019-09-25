module.exports = class extends think.Model {

    async getOverview(){
        let sql = 'select a._date,a._day,'+
        'ifnull(b.order_total,0) as order_total,'+
        'ifnull(b.complete_total,0) as complete_total,'+
        'ifnull(b.cancel_total,0) as cancel_total,'+
        'ifnull(b.amount_total,0) as amount_total,'+
        'ifnull(b.refund_total,0) as refund_total,'+
        'ifnull(b.harvest_total,0) as harvest_total,'+
        'ifnull(b.discount_amount_total,0) as discount_amount_total,'+
        'ifnull(b.platform_profit_total,0) as platform_profit_total,'+
        'ifnull(b.runman_profit_total,0) as runman_profit_total,'+
        'ifnull(b.agent_profit_total,0) as agent_profit_total,'+
        'ifnull(b.growth,0) as growth,'+
        'ifnull(b.interal_amount_total,0) as interal_amount_total,'+
        'ifnull(b.interal_use_number,0) as interal_use_number,'+
        'ifnull(b.distance_total,0) as distance_total,'+
        'ifnull(b.night_price_total,0) as night_price_total,'+
        'ifnull(b.weight_price_total,0) as weight_price_total, '+
        'ifnull(b.growth_amount,0) as growth_amount '+
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
        "left join erd_anlysis_order as b "+
        "on a._date = DATE_FORMAT(b.data_time,'%Y-%m-%d') order by a._date asc";
        let res = await this.query(sql);
        return res
    }
}