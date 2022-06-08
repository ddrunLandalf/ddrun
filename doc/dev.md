# 叮点跑腿小程序 v2-本地开发教程

### 1.开发环境(自行百度安装)

(请严格检查版本)

- nodejs 版本 16.x.x
- redis 版本 5.x
- mysql 版本 8.x 或 5.7 以上版本
- git 版本 2.x

### 2.开发工具

- [Visual Studio Code](https://code.visualstudio.com/)
- [HBuilderX](https://www.dcloud.io/hbuilderx.html)
- [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 3.获取源代码

- 克隆远程代码

```
git clone https://gitee.com/landalfyao/ddrun.git
```

- 目录接口介绍

```
—admin // 后台管理员端 nuxt
—miniapp // 小程序端 uniapp
—server // 服务端 midway
—config.json.bak // 配置文件
—ecosystem.config.js
—nginx.conf.bak
—init.js
—package.json
-README.md

```

### 4.开发服务端

#### 4.1 配置数据库和 redis

- 用 vscode 打开 server 目录
- 找到 src/config/config.local.ts.bak 文件，复制并粘贴到同一目录下，并更名为 config.local.ts
- 打开 src/config/config.local.ts 修改 mysql 及 redis 配置

#### 4.2 安装依赖

- 在 vscode 中打开命令行工具

```
# 执行以下命令
npm install
# 或
yarn
```

#### 4.3 启动服务

启动服务的过程中会自动更新数据库表

```
npm run local
# 或
yarn local
```

- 输出以下内容 说明启动成功

```
⠋ Midway Starting 2022-05-11 17:14:58,504 INFO 44228 [midway:redis] client connect success
[ Midway ] Start Server at  http://127.0.0.1:8001
[ Midway ] Start on LAN http://10.0.5.40:8001
```

#### 4.4 开始开发

- 开发请参考官方文档 [midway](https://midwayjs.org/)

### 5.开发后台管理页面

#### 5.1 配置代理

- 用 vscode 打开 admin 目录
- 找到 nuxt.config.js.bak 文件，复制并粘贴到同一目录下，并更名为 nuxt.config.js
- 打开 nuxt.config.js 修改 localUrl 的域名为 http://localhost:8001

```
const isLocal = process.env.NODE_ENV === 'local';
const isProd = process.env.NODE_ENV === 'prod';
const getProxyTarget = () => {
  const localUrl = 'http://localhost:8001';
  if (isLocal) {
    return localUrl;
  }
  ...
};
```

#### 5.2 安装依赖

- 在 vscode 中打开命令行工具

```
# 执行以下命令
npm install
```

#### 5.3 启动服务

```
npm run local
```

#### 5.4 开始开发

开发文档参考

- Nuxt: [https://www.nuxtjs.cn/](https://www.nuxtjs.cn/)
- AntDesignVue: [https://www.antdv.com/](https://www.antdv.com/)

### 6.开发小程序

#### 6.1 配置 api 地址

- 用 HBuilderX 导入 miniapp 目录
- 找到 util/constant.js.bak 文件，复制并粘贴到同一目录下，并更名为 constant.js
- 打开 util/constant.js 修改 const API = http://localhost:8001

### 6.2 修改小程序 appid

- 打开 manifest.json 找到 appid 参数 并修改

### 6.3 运行

- 点击运行到微信小程序
- 扫码登录微信小程序开发者工具
