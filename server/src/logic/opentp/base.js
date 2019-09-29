
module.exports = class extends think.Logic {
    static get _REST() {
      return true;
    }
  
    constructor(ctx) {
      super(ctx);
    }

    __before() {
       this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
       this.header("Access-Control-Allow-Headers", ["x-requested-with",'content-type']);
       this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE,OPTIONS");
       this.header("Access-Control-Allow-Credentials", "true");
       this.allowMethods = 'post,get';
    }
    
    async checkRules (map) {
      let str = [];
      for(let i in map){
        if(this.post(map[i]) == undefined || this.post(map[i]) == ''){
          str.push(map[i])
        }
      }
      if(str.length > 0){
        return {is:true,str:'缺少必要字段：'+str.toString()}
      }else{
        return {is:false}
      }
    }
}