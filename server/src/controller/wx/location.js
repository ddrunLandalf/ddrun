const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {
    /**
     * 逆地址解析
     */
    async geocoderAction(){
        let key = await this.getSysConfig('map_key');
        if(key.config_content){
            key = JSON.parse(key.config_content);
            let http = await this.$http('https://apis.map.qq.com/ws/geocoder/v1/?location='+this.post('location')+'&key='+key.key, 'GET', {});
            if(http.status === 0) {
                this.success(http.result,http.message)
            }else{
                this.fail(http.message)
            }
        }
    }

    /**
     * 搜索地址
     */
    async searchAction(){
        let key = await this.getSysConfig('map_key');
        if(key.config_content){
            key = JSON.parse(key.config_content);
            let url = 'https://apis.map.qq.com/ws/place/v1/search?key='+ key.key+
                '&keyword='+encodeURI(this.post('keyword'))+
                '&boundary='+'region('+encodeURI(this.post('city_name'))+',0)'+
                '&page_size='+this.post('pageSize')+
                '&page_index='+this.post('pageIndex');
            let http = await this.$http(url, 'GET', {});
            if(http.status === 0) {
                this.success(http.data,http.message)
            }else{
                this.fail(http.message)
            }
        }
    }

    /**
     * 地址解析
     */
    async parseAction(){
        let key = await this.getSysConfig('map_key');
        if(key.config_content){
            key = JSON.parse(key.config_content);
            let http = await this.$http('https://apis.map.qq.com/ws/geocoder/v1/?address='+encodeURI(this.post('address'))+'&key='+key.key , 'GET', {});
            if(http.status === 0) {
                this.success(http.result,http.message)
            }else{
                this.fail(http.message)
            }
        }
    }
}