
module.exports = class extends think.Logic {
    static get _REST() {
      return true;
    }
  
    constructor(ctx) {
      super(ctx);
    }

    async __before() {
       this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
       this.header("Access-Control-Allow-Headers", ["x-requested-with",'token','content-type']);
       this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE,OPTIONS,CLI");
       this.header("Access-Control-Allow-Credentials", "true");
       
    }
    
};