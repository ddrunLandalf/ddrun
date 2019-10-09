const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

    /**
     * 计算价格
     */
    async calculationAction () {
        let startAddress = this.post('startAddress');
        if(startAddress != 'nearby'){
            startAddress = JSON.parse(startAddress);
        }
        let endAddress = JSON.parse(this.post('endAddress'));
        let weight_id = this.post('weight_id');
        let service_type = this.post('service_type');
        let userInfo = this.post('userInfo');

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
            if(startAddress != 'nearby'){
                if(distance > distanceRule.start_distance){
                    exccedDistance = parseInt(distance)-parseInt(distanceRule.start_distance);
                    // 超出部分计价规则  (超出的距离/固定超出距离)向上取整 * 固定超出价格
                    exccedPrice = parseInt(Math.ceil(exccedDistance/parseInt(distanceRule.exceed_everyone_distance)))*parseFloat(distanceRule.exceed_everyone_price)
                }
            }
            let totalPrice = parseFloat(exccedPrice) + parseFloat(distanceRule.start_price);
            let weightRule = await this.model('agent_weight_ruls').where({id:weight_id}).find();
            if(weightRule.id){
                totalPrice += parseFloat(weightRule.price)
            }


            //时间选项
            let timeOption = await this.getSysConfig('send_time');
            if(timeOption.config_content){
                timeOption = JSON.parse(timeOption.config_content)
            }

            return this.success({
                totalPrice: totalPrice.toFixed(2),
                start:{
                    startDistance: distanceRule.start_distance,
                    startPrice: distanceRule.start_price.toFixed(2)
                },
                excced:{
                    exccedDistance,exccedPrice:exccedPrice.toFixed(2)
                },
                weightPrice: service_type == '代驾' ? 0:weightRule.price.toFixed(2),
               
                timeOption: timeOption
            })

        }else{
            return this.fail('服务未配置')
        }
    }

}