module.exports = class extends think.Model {

    async getOverview(day){
        let sql = 'select sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then oc.profit_p else 0 end) as profit_p_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then oc.profit_a else 0 end) as profit_a_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then oc.profit_m else 0 end) as profit_m_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then oc.profit_fu else 0 end) as profit_fu_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then oc.profit_su else 0 end) as profit_su_total '+
        ' from '+
        'erd_order_cents oc , erd_order od,erd_order_ope op '+
        'where oc.order_id = od.id and op.order_id = od.id';
        let res = this.query(sql);
        return res
    }
}