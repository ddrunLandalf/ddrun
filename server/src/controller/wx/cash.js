const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 跑男提现
     */
    async runAction () {
        let ws = await this.runcheck()
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }
        let cashfee = parseFloat(this.post('cashFee'));
        if(cashfee > parseFloat(ws.surplus_amount)){ return this.fail('提现金额大于您的余额了') }
        if(cashfee < parseFloat(cashConfig.run_min_cash)){ return this.fail('提现金额不得小于'+cashConfig.run_min_cash+'元') }
        if(cashfee > parseFloat(cashConfig.run_max_cash)){ return this.fail('提现金额不得大于'+cashConfig.run_max_cash+'元') }
        let code = await this.checktime(cashConfig,ws.id,2);
        if(code.code == -1){
            return this.fail(code.msg)
        }
        let add = await this.model('cash').add({
            user_type:2,
            user_id:ws.id,
            cash_amount:cashfee,
            status:0,
            case_type:1,
            account_id: this.post('account_id')
        })
        await this.model('wxapp_service').where({
            id: ws.id,
        }).update({
            surplus_amount: ['exp','surplus_amount-'+cashfee]
        })
        this.success({id:add},'申请提现成功');
    }

    /**
     * 用户提现
     */
    async userAction () {
        let userInfo = this.post('userInfo');
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }
        let cashfee = parseFloat(this.post('cashFee'));
        if(cashfee > parseFloat(userInfo.surplus_amount)){ return this.fail('提现金额大于您的余额了') }
        if(cashfee < parseFloat(cashConfig.user_min_cash)){ return this.fail('提现金额不得小于'+cashConfig.user_min_cash+'元') }
        if(cashfee > parseFloat(cashConfig.user_max_cash)){ return this.fail('提现金额不得大于'+cashConfig.user_max_cash+'元') }
        let code = await this.checktime(cashConfig,userInfo.id,1);
        if(code.code == -1){
            return this.fail(code.msg)
        }
        let add = await this.model('cash').add({
            user_type:1,
            user_id:userInfo.id,
            cash_amount:cashfee,
            status:0,
            case_type:1,
            account_id: this.post('account_id')
        })
        
        await this.model('wxapp_user').where({
            id: userInfo.id,
        }).update({
            surplus_amount: ['exp','surplus_amount-'+cashfee]
        })
        this.success({id:add},'申请提现成功');
    }

    /**
     * 代理提现
     */
    async agentAction () {
        let agent = await this.agentcheck();
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }
        let cashfee = parseFloat(this.post('cashFee'));
        if(cashfee > parseFloat(agent.surplus_amount)){ return this.fail('提现金额大于您的余额了') }
        if(cashfee < parseFloat(cashConfig.run_min_cash)){ return this.fail('提现金额不得小于'+cashConfig.run_min_cash+'元') }
        if(cashfee > parseFloat(cashConfig.run_max_cash)){ return this.fail('提现金额不得大于'+cashConfig.run_max_cash+'元') }
        let code = await this.checktime(cashConfig,agent.id,3);
        if(code.code == -1){
            return this.fail(code.msg)
        }
        let add = await this.model('cash').add({
            user_type:3,
            user_id:agent.id,
            cash_amount:cashfee,
            status:0,
            case_type:1,
            account_id: this.post('account_id')
        })
        
        await this.model('agent').where({
            id: agent.id,
        }).update({
            surplus_amount: ['exp','surplus_amount-'+cashfee]
        })
        this.success({id:add},'申请提现成功');
    }

    /**
     * 查询跑男余额
     */
    async amountRunAction () {
        let ws = await this.runcheck()
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }

        return this.success({
            surplus_amount: ws.surplus_amount,
            cashConfig: cashConfig
        })        
    }

    /**
     * 查询用户余额
     */
    async amountUserAction () {
        let userInfo = this.post('userInfo');
        if(userInfo.status == 0){
            return this.fail('您的账号已被封')
        }
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }

        return this.success({
            surplus_amount: userInfo.surplus_amount,
            cashConfig: cashConfig
        })      
    }

    /**
     * 查询用户余额
     */
    async amountAgentAction () {
        let agent = await this.agentcheck();
        let cashConfig = await this.getSysConfig('cash');
        if(cashConfig.config_content){
            cashConfig = JSON.parse(cashConfig.config_content)
        }
        return this.success({
            surplus_amount: agent.surplus_amount,
            cashConfig: cashConfig
        }) 
    }

    /**
     * 检查提现次数
     * cash_time=1；每天 2 每周 3 每月
     */
    async checktime(cashConfig,user_id,userType){
        let cashlist = [];
        let text = '';
        if(cashConfig.cash_time == 1){
            cashlist = await this.model('cash').where({
                user_type: userType,
                user_id: user_id,
                'to_days(create_time)': ['exp','=to_days(now())']
            }).select();
            text = '今天';
        }else if(cashConfig.cash_time == 2){
            cashlist = await this.model('cash').where({
                user_type: userType,
                user_id: user_id,
                "YEARWEEK( date_format( create_time,'%Y-%m-%d' ) )":['exp','=YEARWEEK(now())']
            }).select();
            text = '本周';
        }else{
            cashlist = await this.model('cash').where({
                user_type: userType,
                user_id: user_id,
                "DATE_FORMAT( create_time, '%Y%m' )": ['exp',"DATE_FORMAT( CURDATE( ) ,'%Y%m' ) "]
            }).select();
            text = '本月';
        }
        if(cashlist.length >= cashConfig.cash_number){
            return {code:-1,msg:'您'+text+'提现次数已达上限'}
        }else{
            return {code:1}
        }
    }

    /**
     * 跑男检查
     */
    async runcheck(){
        let userInfo = this.post('userInfo');
        let ws = await this.model('wxapp_service').where({wx_id: userInfo.id}).find();

        if(!ws.id){ return this.fail('您不是跑男哦') }

        if(ws.status == 4){ return this.fail('您的账号已被冻结')  }

        if(ws.status == 0 || ws.status == 1){ return this.fail('您申请的跑男资质还没通过审核') }
        return ws
    }

    /**
     * 代理检查
     */
    async agentcheck(){
        let userInfo = this.post('userInfo');
        let agent = await this.model('agent').where({wx_id:userInfo.id}).find();
        if(!agent.id){return this.fail('您不是代理哦')}
        if(agent.is_recover == 1){return this.fail('该城市代理已被移除')}
        return agent
    }

    /**
     * 查询提现记录
     */
    async listAction(){
        let whereOptions = {};
        let userType = this.post('user_type');
        whereOptions['erd_cash.user_type'] = userType;
        if(userType == 1){
            whereOptions['erd_cash.user_id'] = this.post('userInfo').id;
        }else if(userType == 2){
            let ws = await this.model('wxapp_service').where({wx_id: this.post('userInfo').id}).find();
            whereOptions['erd_cash.user_id'] = ws.id
        }else if(userType == 3){
            let agent = await this.model('agent').where({wx_id: this.post('userInfo').id}).find();
            whereOptions['erd_cash.user_id'] = agent.id
        }
        let result = await this.model('cash').join({ table: 'cash_account',  join: 'left', on: ['account_id', 'id'] })
            .where(whereOptions)
            .order('erd_cash.status asc,erd_cash.create_time desc')
            .group('erd_cash.id')
            .field("erd_cash.*,erd_cash_account.account_name,erd_cash_account.realname,erd_cash_account.account_number")
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

}