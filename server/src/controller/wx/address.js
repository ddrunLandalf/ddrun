const BaseRest = require('../rest.js');
module.exports = class extends BaseRest {

  /**
   * 添加地址
   */
  async addAction () {
    let add = await this.model('wxapp_address').add({
        province: this.post('province'),
        city: this.post('city'),
        district: this.post('district'),
        latitude: this.post('latitude'),
        longitude: this.post('longitude'),
        phone: this.post('phone'),
        name: this.post('name'),
        street_number: this.post('street_number'),
        address_detail: this.post('address_detail'),
        formatted_addresse: this.post('formatted_addresse'),
        wx_id: this.post('userInfo').id
    })
    if(this.post('address_default')){
        let updateData = { };
        updateData[this.post('address_default')] = add;
        await this.model('wxapp_user').where({id:this.post('userInfo').id}).update(updateData)
    }
    return this.success({id:add},'保存地址成功')
  }

  /**
   * 更新地址
   */
  async updateAction () {
    let update = await this.model('wxapp_address').update({
        province: this.post('province'),
        city: this.post('city'),
        district: this.post('district'),
        latitude: this.post('latitude'),
        longitude: this.post('longitude'),
        phone: this.post('phone'),
        name: this.post('name'),
        street_number: this.post('street_number'),
        address_detail: this.post('address_detail'),
        formatted_addresse: this.post('formatted_addresse'),
        id: this.post('id'),
        recent_use:['exp', 'CURRENT_TIMESTAMP()']
    })
    if(this.post('address_default')){
        let updateData = { };
        updateData[this.post('address_default')] = this.post('id');
        await this.model('wxapp_user').where({id:this.post('userInfo').id}).update(updateData)
    }
    return this.success({id:update},'保存地址成功')
  }

   /**
     * 获取家和公司地址
     */
    async hcAction () {
        let userInfo = this.post('userInfo');
        return this.success({
            home:await this.model('wxapp_address').where({id:userInfo.home_address_id}).find(),
            company:await this.model('wxapp_address').where({id:userInfo.company_address_id}).find(),
        })
    }

    /**
     * 获取近期访问地址
     */
    async recentAction () {
        let userInfo = this.post('userInfo');
        let rs = await this.model('wxapp_address')
            .where({id:['NOTIN',[userInfo.home_address_id,userInfo.company_address_id]],wx_id:userInfo.id})
            .page(1,10)
            .order('recent_use desc,create_time desc').select()
        return this.success(rs)
    }

    

}