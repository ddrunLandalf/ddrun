const crypto = require('crypto'); 

global.jwtSecret = 'err'; //jwt 加密解密的密钥
global.superAdmin = 1;

global.commonListRule = {
  sorts: {
    string: true,      
    required: true,    
  },
  currentPage: {
    int: true,      
    required: true,    
  },
  pageSize: {
    int: true,      
    required: true, 
  }
}

global.md5 = function md5(data){
  let hash = crypto.createHash('md5');
  return hash.update(data).digest('base64');
}
