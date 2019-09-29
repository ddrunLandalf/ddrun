const BaseRest = require('./orderBase.js');
module.exports = class extends BaseRest {
    
    /**
     * 下单
     */
    async payAction () {
        let startAddress = this.post('startAddress'); //起点地址
        if(startAddress != 'nearby'){
            startAddress = JSON.parse(startAddress);
        }   
        let endAddress = JSON.parse(this.post('endAddress'));       //终点地址
        let weight_id = this.post('weight_id');        //重量
        let service_type = this.post('service_type');  //服务类型
        let timeValue = this.post('timeValue');       //时间值
        let userInfo = this.post('userInfo');        //下单用户
        let couponId = this.post('couponId');  //优惠券ID
        let useInteral = this.post('useInteral');  //使用积分
        let tip = this.post('tip');  //小费
        
        let serviceConfig = await this.getSysConfig('service');
        if(serviceConfig.config_content){
            serviceConfig = JSON.parse(serviceConfig.config_content);
            let agent ;
            if(serviceConfig.open_agent === 1){
                let city = '';
                if(service_type == '帮我送' || service_type == '代驾'){
                    city = startAddress.city
                }else{
                    city = endAddress.city
                }
                //开启代理时
                agent = await this.model('agent').where({city_name: city}).find();
                if(!agent.city_name){
                    return this.fail(city+'还没有开通服务哦')
                }
                if(startAddress != 'nearby'){
                    if(startAddress.city != endAddress.city && agent.cross_city_service == 0){
                        return this.fail(startAddress.city+'不支持跨城服务')
                    }
                }

            }else{
                if(startAddress != 'nearby'){
                    if(startAddress.city != endAddress.city && serviceConfig.cross_city_service == 0 ){
                        return this.fail('不支持跨城服务')
                    }
                }
            }


            let distanceRule = await this.model('agent_distance_rules').where({agent_id: serviceConfig.open_agent === 1 ? agent.id:0,rule_type:service_type}).find();
            if(!distanceRule.id){
                return this.fail('路程计算规则未设置')
            }
            let distance ;
            if(startAddress == 'nearby'){
                distance = distanceRule.start_distance;
            }else{
                distance = await this.getDistance(startAddress.latitude+','+startAddress.longitude,endAddress.latitude+','+endAddress.longitude);
                if(distance.status != 0){
                    return this.fail('距离计算有误',distance)
                }
                distance = distance.result.elements[0].distance; //获得距离 单位(米)
            }
            if(distance > distanceRule.max_distance){
                return this.fail('超出最大服务距离'+distanceRule.max_distance/1000 + 'km');
            }
            let exccedDistance = 0; //超出起步路程部分
            let exccedPrice = 0; //超出起步路程部分计价 
            if(distance > distanceRule.start_distance){
                exccedDistance = parseInt(distance)-parseInt(distanceRule.start_distance);
                // 超出部分计价规则  (超出的距离/固定超出距离)向上取整 * 固定超出价格
                exccedPrice = parseInt(Math.ceil(exccedDistance/parseInt(distanceRule.exceed_everyone_distance)))*parseInt(distanceRule.exceed_everyone_price)
            }
            let totalPrice = parseFloat(exccedPrice) + parseFloat(distanceRule.start_price);
            let weightRule = await this.model('agent_weight_ruls').where({id:weight_id}).find();
            if(weightRule.id){
                totalPrice += parseFloat(weightRule.price)
            }

            let couponPrice = 0;
           

            let exchange = 0;
            let changeValue = 0;
            if(useInteral == 1){
                //积分
                let interalConfig = await this.getSysConfig('interal');
                if(interalConfig.config_content){
                    interalConfig = JSON.parse(interalConfig.config_content);
                    let maxExchange = parseFloat(interalConfig.max_exchange) * parseFloat(totalPrice);
                    let canExchange = userInfo.surplus_integral/interalConfig.exchange;
                    if(canExchange >maxExchange){
                        exchange = maxExchange
                    }else{
                        exchange = canExchange
                    }
                }
                if(exchange > 0){
                    changeValue = exchange*interalConfig.exchange
                }
                totalPrice -= exchange;
            }


            //时间选项
            let timeOption = await this.getSysConfig('send_time');
            let nightPrice = 0;
            if(timeOption.config_content){
                timeOption = JSON.parse(timeOption.config_content);
                if(timeOption.open_night && timeOption.open_night == 1){
                    let temp = -1;
                    let timev = timeValue;
                    if(timev == -1) {
                        timev = new Date().getHours();
                    }
                    for(let i in timeOption.nightOptons){
                        if(timeOption.nightOptons[i] == timev){
                            temp = i;
                        }
                    }
                    if(temp != -1){
                        nightPrice = timeOption.nightPrice;
                        totalPrice += parseFloat(nightPrice);
                    }
                }
            }

            totalPrice += parseInt(tip); //小费

            let totalFee = parseInt(totalPrice*100);
            let pay;
            if(totalFee > 0){
                pay = await this.unifiedorder(service_type,totalFee);
            }else{
                pay.totalFee = 0;
                pay.out_trade_no = think.uuid('v4').replace(/-/g,"");
            }
            let order = await this.model('order').add({
                order_no: pay.out_trade_no,
                pay_amount: totalPrice,
                pay_type:1,
                wxcoupon_id:couponId,
                discount_amount:couponPrice,
                service_type:service_type,
                interal_value: changeValue,
                interal_amount: exchange,
                night_price: nightPrice,
                start_distance_amount:distanceRule.start_price,
                exceed_distance_amount:exccedPrice,
                exceed_distance:exccedDistance,
                weight_id:weight_id,
                weight_price: service_type == '代驾' ? 0: weightRule.price,
                status:totalFee > 0 ? 0:1,
                start_address: this.post('startAddress'),
                end_address: this.post('endAddress'),
                goods_des: this.post('textarea'),
                send_time: this.post('send_time'),
                form_ids:this.post('form_ids'),
                wx_id: userInfo.id,
                openid: userInfo.openid,
                tip: this.post('tip'),
                distance: distance
            });
            await this.model('order_ope').add({
                order_id: order
            })
            if(order > 0){
                
                await this.model('wxapp_user').where({id:userInfo.id}).update({
                    surplus_integral: parseInt(userInfo.surplus_integral) - parseInt(changeValue)
                })
            }
            pay.order_id = order;
            let _this = this;
            let ints = 0;
            let see = setInterval( async function() {
                let bool = await _this.ispay(pay.out_trade_no);
                ints += 1
                if(bool){
                    clearInterval(see);
                }
                if(ints == 30*15){
                    clearInterval(see);
                }
            },2000)
            return this.success(pay)
            
        }else{
            return this.fail('服务未配置')
        }
    }

    //查询一个订单
    async findAction(){
        let res = await this.model('order').where({order_no: this.post('order_no')}).find();
        if(res.id){
            if(res.status === 0){
                let forder = await this.wxFindOrder(res.order_no);
                if(forder.trade_state[0] == 'SUCCESS'){
                    await this.model('order').where({ order_no: res.order_no }).update({status: 1});
                    let time = forder.time_end[0];
                    time = time.substring(0,4)+'-'+time.substring(4,6)+'-'+ time.substring(6,8) + ' '+ time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14);
                    await this.model('order_ope').where({order_id:res.id}).update({status_time1: time});
                    res = await this.model('order').where({order_no: this.post('order_no')}).find();
                   
                    return this.success(res)
                }
            }
            return this.success(res)
        }else{
            this.fail('未查询到订单')
        }
    }

    async findtimeAction () {
        let res = await this.model('order_ope').where({order_id: this.post('order_id')}).field('*,(UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(status_time2))/60 dif_minute').find();
        return this.success(res)
    }

    //检查是否支付
    async ispay (order_no) {
        let forder = await this.wxFindOrder(order_no);
        if(forder.trade_state[0] == 'SUCCESS'){
            let res = await this.model('order').where({order_no: order_no}).find();
            if(res.id == 0){
                let ispay = await this.model('order').where({ order_no: order_no }).update({status: 1});
                let time = forder.time_end[0];
                time = time.substring(0,4)+'-'+time.substring(4,6)+'-'+ time.substring(6,8) + ' '+ time.substring(8,10)+':'+time.substring(10,12)+':'+time.substring(12,14);
                await this.model('order_ope').where({order_id:res.id}).update({status_time1: time});
                
                return true
            }else{
                return true
            }
        }else{
            return false
        }
    }

    //用户获取订单列表
    async listAction () {
        let userInfo = this.post('userInfo');
        let res = await this.model('order').where({
            wx_id: userInfo.id,
            status: ['IN','1,2']
        }).select();
        let list = await this.model('order').where({wx_id:userInfo.id,status: ['IN','-2,-1,0,3,4']})
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();
        return this.success({ing:res,data:list})
    }


    /**
     * 接单列表
     */
    async takelistAction(){
        let userInfo = this.post('userInfo');
        let sendMode = 1;
        let cf = await this.getSysConfig('send_mode');
        let tagFlag = this.post('tagFlag');
        if(cf.config_content){
            sendMode = JSON.parse(cf.config_content).mode_type;
        }
        let ws = await this.model('wxapp_service').where({wx_id: userInfo.id}).find();
        let result ;
        let whereOption = {
            status : 1,
            service_type: ws.ws_type == 1 ? ['IN','帮我送,帮我取,帮我买']:'代驾',
            
        };
        if(tagFlag == 0){
            whereOption.status = 1;
            whereOption.ws_id = 0;
           
        }else if(tagFlag == 1){
            if(ws.id){
                whereOption.ws_id = ws.id;
            }
            whereOption.status = 2;
        }else if(tagFlag == 2){
            if(ws.id){
                whereOption.ws_id = ws.id;
            }
            whereOption.status = ['IN','3,4,-2,-1'];
        }

        
        result = await this.model('order')
            .where(whereOption)
            .order('create_time desc')
            .page(this.post('currentPage'),this.post('pageSize')).countSelect();

        return this.success(result)
    }

    

    //接单
    async receiveAction(){
        let check = await this.checkRunman();
        if(!check.check){
            return this.fail(check.msg)
        }
        let ws = check.ws;
        let order = check.order;
        let appConfig = check.appConfig;
        if(order.status == 1 && (order.ws_id == 0 || order.ws_id == ws.id)){
            let update = await this.model('order').where({id: order.id}).update({
                ws_id: ws.id,
                status: 2
            })
            await this.model('order_ope').where({order_id: order.id}).update({
                status_time2: think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss')
            })
            let end = JSON.parse(order.end_address)
            if(order.order_type == 1){
                let appli = await this.model('opentp_app').where({app_key: order.opentp_key}).find();
                let http = await this.$http(appli.cb_url, 'POST', {
                    errmsg: '接单成功',
                    status: 2,
                    order_no: order.order_no
                });
            }else{
                /**发送模板消息 */
                await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT0177'),order.form_ids.split(',')[0],'/pages/order/detail/detail?order_no='+order.order_no,{
                    keyword1: {value:'配送中'},
                    keyword2: {value:order.order_no},
                    keyword3: {value:order.create_time},
                    keyword4: {value:end.formatted_addresse + end.street_number + (end.address_detail || '')},
                    keyword5: {value:ws.realname.substring(0,1) + '师傅'}
                })
                /**发送模板消息 */
            }

            return this.success({},'接单成功')
        }else{
            return this.fail('订单已被接手或以分配')
        }
    }

    
    //跑男确认送达
    async confirmSendAction (){
        let check = await this.checkRunman();
        if(!check.check){
            return this.fail(check.msg)
        }
        let ws = check.ws;
        let order = check.order;
        let appConfig = check.appConfig;
        if(order.status == 2 &&  order.ws_id == ws.id) {
            let update = await this.model('order').where({id: order.id}).update({
                ws_id: ws.id,
                status: 3
            })
            await this.model('order_ope').where({order_id: order.id}).update({
                status_time3: think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss')
            })
            let end = JSON.parse(order.end_address)
            if(order.order_type == 1){
                let appli = await this.model('opentp_app').where({app_key: order.opentp_key}).find();
                let http = await this.$http(appli.cb_url, 'POST', {
                    errmsg: '确认送达',
                    status: 3,
                    order_no: order.order_no
                });
            }else{
                /**发送模板消息 */
                await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT1853'),order.form_ids.split(',')[1],'/pages/order/detail/detail?order_no='+order.order_no,{
                    keyword1: {value:order.service_type},
                    keyword2: {value:order.order_no},
                    keyword3: {value:end.formatted_addresse + end.street_number + (end.address_detail || '')},
                    keyword4: {value:ws.realname.substring(0,1) + '师傅'}
                })
                /**发送模板消息 */
            }

            return this.success({},'已确认送达')
        }else{
            return this.fail('订单状态有误')
        }
    }

    //跑男确认完成
    async confirmRunAction () {
        let check = await this.checkRunman();
        if(!check.check){
            return this.fail(check.msg)
        }
        let ws = check.ws;
        let order = check.order;
        let appConfig = check.appConfig;
        if(order.status == 3 &&  order.ws_id == ws.id) {
            let update = await this.model('order').where({id: order.id}).update({
                ws_id: ws.id,
                status: 4
            })
            let time = think.datetime(new Date().valueOf(), 'YYYY-MM-DD HH:mm:ss')
            await this.model('order_ope').where({order_id: order.id}).update({
                status_time4: time,
                ope_type4:2
            })
            if(order.pay_amount > 0){
                await this.userPayGrant(order,order.wx_id)
            }
            if(order.order_type == 1){
                let appli = await this.model('opentp_app').where({app_key: order.opentp_key}).find();
                let http = await this.$http(appli.cb_url, 'POST', {
                    errmsg: '确认完成',
                    status: 4,
                    order_no: order.order_no
                });
            }else{

                /**发送模板消息 */
                await this.templateNotice(appConfig.appid,appConfig.app_secert,'wxapp_token',order.openid,await this.getWxappTemplateId('AT0257'),order.form_ids.split(',')[2],'/pages/order/detail/detail?order_no='+order.order_no,{
                    keyword1: {value:'订单已完成'},
                    keyword2: {value:order.order_no},
                    keyword3: {value:time},
                    keyword4: {value:order.pay_amount}
                })
                /**发送模板消息 */
            }
            return this.success({},'已确认完成')
        }else{
            return this.fail('订单状态有误')
        }
    }

    //用户消费行为累计
    async userPayGrant(order,wx_id){
        let config = await this.getSysConfig('interal');
        let updateData = {
            grand_fee: ['exp','grand_fee +'+order.pay_amount]
        }
        if(config.config_content){
            config = JSON.parse(config.config_content);
            if(config.getInteral){
                updateData.grand_integral = ['exp','grand_integral +'+(order.pay_amount*config.getInteral)];
                updateData.surplus_integral = ['exp','surplus_integral +'+(order.pay_amount*config.getInteral)];
            }
        }
        //累计消费 和积分
        await this.model('wxapp_user').where({id: wx_id}).update(updateData)
    }

   
}