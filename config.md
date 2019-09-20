阅读本文档前，请先将项目部署成功。
### 一、微信小程序配置
- ##### 1.配置小程序基础信息
![dd1.png](https://upload-images.jianshu.io/upload_images/17329156-9100ee6db4a23516.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- ##### 2.小程序appid和密钥配置
- 点击链接进入微信公众号登录页面：[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)
- 点击开发>开发设置
AppSecret 需要手动点击生成，如下图所示：
![获取Appid和AppSecret](https://upload-images.jianshu.io/upload_images/17329156-5d2257e2402dd31a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 将appid和appSecret填入 小程序配置中，如下图所示：
![dd2.png](https://upload-images.jianshu.io/upload_images/17329156-8b69516634ceaf47.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- ##### 3.微信支付配置
- 登录微信商户平台：[https://pay.weixin.qq.com](https://pay.weixin.qq.com)
- 进入【账户中心】>【商户信息】可以获得“微信支付商户号”
- 进入【账户中心】>【API安全】设置API密钥并设置API证书，让后可获得API密钥并将API证书下载下来。
- 将商户信息填入微信支付配置中，如下图所示：
![dd3.png](https://upload-images.jianshu.io/upload_images/17329156-86890465a2f9ff79.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- ##### 4.小程序模板消息配置
- 根据图中提供的ID在模板库中查找，根据关键字的顺序，添加关键字。然后把生成的模板ID添加到这里
![dd4.png](https://upload-images.jianshu.io/upload_images/17329156-4e241659c49fe667.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 二、腾讯地图API key 配置
- 登录腾讯地图开放平台：[https://lbs.qq.com/](https://lbs.qq.com/)
- 进入【控制台】>【key管理】>【创建新密钥】将生成的密钥填入配置中，点击保存即可生效。
![dd5.png](https://upload-images.jianshu.io/upload_images/17329156-b73efff904540d89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 三、阿里云短信配置
- 登录阿里云：[https://www.aliyun.com](https://www.aliyun.com/)
- 进入【控制台】>【短信服务】根据下图所示可以获取到accessKey、短信签名、短信模板
- 注意：短信签名和短信模板均需要通过审核后才能生效

![dd6.png](https://upload-images.jianshu.io/upload_images/17329156-1a06280f5148e942.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
配置到此处，程序就可以正常使用了。
### 四、公众号设置
- 公众号必须是已通过微信认证的服务号，用做接单提醒。
- #####1.设置公众号基本配置
- 登录您的微信服务号：[https://mp.weixin.qq.com](https://mp.weixin.qq.com/)
- 进入【基本配置】可获得appid和AppSecret
- 启用服务器配置：填写服务器地址(URL)、令牌(Token)、消息加解密密钥(EncodingAESKey)、消息加解密方式
- URL请填写您的服务端访问域名 注意 后面需要带上“/wxp/base/dev”；如“http://x.x.x.x/wxp/base/dev”
- Token 请自行随机填写
- EncodingAESKey可以点击随机生成
- 消息加解密方式 请选择明文模式
- 设置以上内容即可将此填入公众号配置中

- #####2.模板消息设置
- 根据图中提供的模板编号在模板库中查找，然后查看详情直接点击添加。然后把生成的模板ID添加到这里
![dd8.png](https://upload-images.jianshu.io/upload_images/17329156-cfbb3e7e8c5328b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
