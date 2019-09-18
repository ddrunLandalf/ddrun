const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {
    /** 
     * 图表数据
     */
    async overviewAction(){
        let overview = await this.model('anlysis_order').getOverview();
        let wxuser = await this.model('anlysis_wxuser').getOverview();
        //成交量
        let turnover = [];
        let turnoverSerise = [];
        let turnoverMax = 0;
        //同比增长
        let turnoverGrowth = overview[6].growth;
        //成交额
        let turnoverAmounts = [];
        let turnoverAmountsSerise = [];
        let turnoverAmountsMax = 0;
        //同比增长
        let turnoverAmountsGrowth = overview[6].growth_amount;
        for(let i in overview){
            if(overview[i].complete_total > turnoverMax){
                turnoverMax = overview[i].complete_total;
            }
            if(overview[i].harvest_total > turnoverAmountsMax){
                turnoverAmountsMax = overview[i].harvest_total;
            }
            turnover.push(overview[i]._day + '日');
            turnoverSerise.push(overview[i].complete_total);
            turnoverAmounts.push(overview[i]._day + '日');
            turnoverAmountsSerise.push(overview[i].harvest_total);
        }
        //用户
        let wxusers = turnover;
        let wxuserSerise = [];
        let wxuserMax = 0;
        let wxuserGrowth = wxuser[6].growth;
        for(let i in wxuser){
            if(wxuser[i].user_total > wxuserMax){
                wxuserMax = wxuser[i].user_total;
            }
            wxuserSerise.push(wxuser[i].user_total);
        }
        return this.success({
            turnover: turnover,
            turnoverSerise: turnoverSerise,
            turnoverGrowth: turnoverGrowth,
            turnoverAmounts: turnoverAmounts,
            turnoverAmountsSerise: turnoverAmountsSerise,
            turnoverAmountsGrowth: turnoverAmountsGrowth,
            turnoverMax: turnoverMax +10,
            turnoverAmountsMax: turnoverAmountsMax +10,
            wxusers:wxusers,
            wxuserSerise:wxuserSerise,
            wxuserMax:wxuserMax +10,
            wxuserGrowth:wxuserGrowth ,
            vipCount: 0
        })
    }

    /**
     * 订单数据
     * type:1 订单的数据  type:2 分成数据
     */
    async orderAction () {
        
        let result = await this.model('anlysis_order')
            .order('data_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

    
}