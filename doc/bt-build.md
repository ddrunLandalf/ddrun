# 叮点跑腿小程序 v2-宝塔面板部署教程

### 1.准备工作

请自行安装以下软件

- 安装 宝塔面板

#### 1.1 进入面板->【软件商店】

- 安装 nginx 选择 1.18 版本
- 安装 mysql 选择 8.0 或 5.x 版本
- 安装 PM2 管理器, 进入管理器 Node 版本选择 v16.x.x, 作者开发是 v16.14.0, 然后点击切换版本
- 安装 redis 最新即可

### 2.拉取代码->点击【终端】

```
# 进入到工作目录
cd /www/wwwroot

# 拉取叮点跑腿代码 生成 ddrun文件夹
git clone https://gitee.com/landalfyao/ddrun.git

# 拷贝config.json.bak 为 config.json
cd ddrun
cp config.json.bak config.json
```

### 3.修改配置文件->点击【文件】

- 点击 ddrun 进入目录 或者 直接终端里用 vim 编辑
- 找到 config.json, 点击编辑
- 请认真配置完以下内容

```
{
  "name": "叮点跑腿", // 小程序的名称
  "opName": "叮点跑腿后台管理系统", // 后台展示的名称
  "domain": "xxx.xxx.com", // 域名
  "perfix": "http", // 小程序访问的域名前缀
  "serverPort": "8001", // 请确保此端口没有被占用
  "mysql": {
    "host": "xxx.xxx.com", // 本地mysql请填写 127.0.0.1
    "port": 3306,
    "username": "xxx",
    "password": "xxxxxx",
    "database": "ddrunv2",
    "synchronize": true, // 是否同步数据库
    "logging": false,
    "charset": "utf8mb4" // 数据库编码
  },
  "redis": {
    "client": {
      "port": 6379,
      "host": "xxx.xxx.com",
      "password": "xxxxxx",
      "db": 0
    }
  }
}

```

#### 3.1 上传微信支付 API 证书

- 上传 微信支付 API 证书 到 cert/目录下 必须包含以下文件且命名参考以下文件
- - apiclient_cert.p12
- - apiclient_cert.pem
- - apiclient_key.pem

#### 3.2 上传 ssl 文件（测试可忽略此步骤）

- 上传 ssl 文件到 ssl/目录下 必须含有.crt .key 文件

- 保存继续下一步

### 4.部署->点击【终端】

```
# 进入到项目跟目录
cd /www/wwwroot/ddrun

# 安装yarn 如果已有，忽略此步
npm i -g yarn

# 安装依赖
yarn

# 开始部署
yarn start

```

- 部署失败解决方案

```
# 如果出现以下情况
【服务构建】 /bin/sh: midway-bin: command not found

# 手动构建服务
cd server
yarn build
cd ..
yarn server-start
```

```
# 如果出现以下情况
【后台构建】 /bin/sh: nuxt: command not found

# 手动构建后台
cd admin
yarn build
```

### 5.nginx 反向代理

- 部署完成后会生成 nginx.conf 文件
- 1.点击【软件商店】->【Nginx1.18.0】设置-> 配置修改(拉到底部)->引入 nginx.conf 文件

```
...
        access_log  /www/wwwlogs/access.log;
    }
include /www/server/panel/vhost/nginx/*.conf;

# 引入文件
include /www/wwwroot/ddrun/nginx.conf;
}
```

- 2.点击保存 -> 点击服务 -> 点重启
- 如果没有上传 ssl 文件，那么需要修改 nginx.conf 删除 ssl 相关配置代码
- 编辑 nginx.conf 只保留以下代码即可，然后在执行 1、2 步骤

```
server {
        listen 80;
        server_name paotui.api1688.top;
        location / {
                root /www/wwwroot/ddrun/admin/dist;
                index index.html index.htm;
                try_files $uri $uri/ /index.html;
        }
        location /admin {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Real-Port $remote_port;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://127.0.0.1:8001/admin;
        }
        location /api {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Real-Port $remote_port;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_pass http://127.0.0.1:8001/api;
        }
}
```

### 6.更新代码

```
# 到项目更目录
cd ddrun
# 拉取更新
git pull origin master
# 部署(不会影响数据库和redis)
yarn start
```
