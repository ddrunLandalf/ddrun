## 项目目录介绍
```
|--server //服务端目录
|--client //后台客户端目录
|--wxapp //微信小程序项目目录
|--ddrun.sql //数据库文件
```
## 准备工作
- 1.微信小程序账号 (需要企业版+微信认证)
- 2.微信商户号 需要支付证书 用做退款功能 
- 3.如需公众号提醒功能 需要认证过的服务号
- 4.阿里云短信相关的东西
- 5.腾讯地图API key
- 拥有以上全部内容，即可进行安装部署操作。
## 一、安装环境
- 方案一、自行手动安装git、nodejs、mysql、pm2管理器
- 方案二、安装“宝塔面板”，然后进入"软件管理"安装nginx、pm2管理器(自带nodejs)、mysql。
- 若安装过程中出现报错问题，请检查软件版本问题。
- 请参考作者的服务器环境：mysql5.5 | node v8.9.1
## 二、部署服务端
请先将数据库文件导入到数据库。数据库编码为“utf8mb4”
#### 1、修改pm2.json文件
- 文件目录：server/pm2.json
- name为项目名，cwd为项目再服务器的根目录，其他无需更改。
```
{
  "apps": [{
    "name": "runing_demo",   //项目名称
    "script": "production.js",
    "cwd": "/www/wwwroot/nodeproject/runing_demo",   //服务器项目根目录
    "exec_mode": "fork",
    "max_memory_restart": "1G",
    "autorestart": true,
    "node_args": [],
    "args": [],
    "env": {
    }
  }]
}
```
#### 2、修改配置文件adapter.js
文件目录：server/src/config/adapter.js
```
...省略以上配置...
/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'ddrun_demo',  //数据库名称
    prefix: 'erd_',  
    encoding: 'utf8',  
    host: '127.0.0.1',  //地址
    port: '',    //默认3306
    user: 'root', //用户名
    password: 'root', //密码
    dateStrings: true
  }
};
...省略以下配置...
```
#### 3、安装依赖
```
#1.进入项目目录
$ cd server 
#2.安装依赖
$ npm install
```
#### 4、运行项目
```
#线上运行
$ npm run compile
$ pm2 start pm2.json

#本地运行
$ node development.js
```
- 项目默认端扣为8360。服务端默认访问地址为：http://x.x.x.x:8360/
- 建议使用nginx做域名反向代理
## 三、部署后台客户端
#### 1、修改apiurl.js文件
文件目录：client/public/js/apiurl.js
```
export default 'http://x.x.x.x:8360/' //改为服务端访问地址
```
#### 2、安装依赖
```
#1.进入项目目录
$ cd client
#2.安装依赖
$ npm install
```
#### 3、运行项目
```
#线上运行
$ pm2 start npm -- run serve

#本地运行
$ npm run serve
```
- 项目默认端扣为8361。服务端默认访问地址为：[http://x.x.x.x:8361/](http://x.x.x:8361/)
- 默认登录账号：admin   密码：qwe147258
- 建议使用nginx做域名反向代理
## 四、运行微信小程序
#### 修改util.js文件
文件目录：wxapp/utils/util.js
```
const util = {
  API: 'http://x.x.x.x:8360/',   //改为服务端地址
  ...
  ...
  ...
```
## 五、上传体验版测试，测试无误后，即可上线使用。
如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！