const Core = require('@alicloud/pop-core');

/**
 * 发送短信
 * @param {*} accessKeyId 
 * @param {*} accessKeySecret 
 * @param {*} params
 * params 包含  RegionId,PhoneNumbers,SignName,TemplateCode
 */
function sendSms(accessKeyId,accessKeySecret,params){
      let client = new Core({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
      });
      
      var _params = params
      
      var requestOption = {
        method: 'POST'
      };
      
      client.request('SendSms', _params, requestOption).then((result) => {
        console.log(JSON.stringify(result));
      }, (ex) => {
        console.log(ex);
      })
}
module.exports = {
    sendSms:sendSms
}