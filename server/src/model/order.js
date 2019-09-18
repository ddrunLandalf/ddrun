module.exports = class extends think.Model {

    
    async dayAnlysis(day){
        let sql = 'select '+  
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then 1 else 0 end) as complete_total,'+
        'sum(case when TO_DAYS(op.status_time2_) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = -2 then 1 else 0 end) as cancel_total,'+
        'sum(case when TO_DAYS(op.status_time1) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status in (1,2,3,-2) then od.pay_amount else 0 end) as amount_total,'+
        'sum(case when TO_DAYS(op.status_time2_) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = -2 then od.refund_amount else 0 end) as refund_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.discount_amount else 0 end) as discount_amount_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.interal_amount else 0 end) as interal_amount_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.interal_value else 0 end) as interal_use_number,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.distance else 0 end) as distance_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.night_price else 0 end) as night_price_total,'+
        'sum(case when TO_DAYS(op.status_time4) = TO_DAYS(date_sub(now(), interval '+day+' day)) and od.status = 4 then od.weight_price else 0 end) as weight_price_total '+
        ' from '+
        'erd_order od ,erd_order_ope op '+
        'where od.id = op.order_id';
        let res = this.query(sql);
        return res
    }

    async orderComDailyData(ws_id){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4 and TO_DAYS(op.status_time4)=TO_DAYS(now()) and od.ws_id='+ws_id;
        let res = this.query(sql);
        return res
    }

    async orderComMonthData (ws_id){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4 and date_format(op.status_time4,"%Y-%m")=date_format(now(),"%Y-%m") and od.ws_id='+ws_id;
        let res = this.query(sql);
        return res
    }

    async orderComData (ws_id){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4 and od.ws_id='+ws_id;
        let res = this.query(sql);
        return res
    }

    async agentDailyData(city){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4 and TO_DAYS(op.status_time4)=TO_DAYS(now()) '+
        'and (( od.service_type in ("帮我送","代驾") and od.start_address like "%'+city+'%" ) or ( od.service_type in ("帮我取","帮我买") and od.end_address like "%'+city+'%"))';
        let res = this.query(sql);
        return res
    }
    async agentMonthData(city){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4 and date_format(op.status_time4,"%Y-%m")=date_format(now(),"%Y-%m") '+
        'and (( od.service_type in ("帮我送","代驾") and od.start_address like "%'+city+'%" ) or ( od.service_type in ("帮我取","帮我买") and od.end_address like "%'+city+'%"))';
        let res = this.query(sql);
        return res
    }
    async agentDailyData(city){
        let sql = 'select count(*) total from erd_order od , erd_order_ope op where od.id = op.order_id and od.status=4  '+
        'and (( od.service_type in ("帮我送","代驾") and od.start_address like "%'+city+'%" ) or ( od.service_type in ("帮我取","帮我买") and od.end_address like "%'+city+'%"))';
        let res = this.query(sql);
        return res
    }
    
}