# cupboard

## 一、开发规范

### 1.命名需遵从以下原则

- 变量名驼峰规范
- 常量首字母大写
- 禁止缩写 详细一些
- 数组一律 s 结尾 users buckets
- 函数命名规范 动词开头 can get set load send handle filter fetch
- 组件的文件夹为 小写字母+下划线 组件名为驼峰 首字母大写

### 2.框架

- nuxt
- ant-design
- less
- typescript
- 使用 eslint 和 prettier .vscode
- 使用 yarn 代替 npm

### 3.git 规范

- 使用前缀 fix: bug fixed
  （注意，是英文的冒号，后面跟一个英文的空格）
  > feat: 新功能（feature）
  > fix: 修补 bug
  > docs: 文档（documentation）
  > style: 格式（不影响代码运行的变动）
  > refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
  > test: 增加测试
  > chore: 构建过程或辅助工具的变动
- 使用 pull request
- 使用 dev 分支开发

### 4.全局组件

- 注册到全局的组件一律写到 ~/components/base 目录下
- 在~/components/base/index.js 中注册组件

### 5.文件创建规范

- ~/pages 目录下创建页面文件夹+index.ts
- 页面的所有组件编写在~/components 目录下，并以页面的文件夹命名
- 公用混合方法文件写在~/plugins/mixins 目录下

## 二、产品介绍

### 1.产品树

- room 房间

  - skirting 踢脚线
  - obstacle 障碍物

- cupboard 柜子的整体设置
  - skirting 踢脚线设置
  - topEdgeSeal 顶部封边
  - cabinet 柜体
    - plate 板材
      - plateTexture 板材材质
    - plateGroup 板材组
      - plate 板材
        - plateTexture 板材材质
    - door 门
      - plate 板材
        - plateTexture 板材材质

## 测试服

- ssh cupboard@cupboard.landalf.cn
- 124.223.31.68

### 1.系统配置

- 操作系统 Ubuntu Server 20.04 LTS 64bit
- sudo adduser cupboard
- pwd: qwe123123.
- chmod u+w /etc/sudoers sudoers 文件添加写权限
- sudo vim /etc/sudoers 添加 cupboard 的 sudo 权限
- chmod u-w /etc/sudoers 销毁写权限
- sudo ufw enable 启动防火墙
- sudo ufw allow '22/tcp' 22 端口开放

### 2.配置免密登录

- vim .ssh/authorized_keys

### 3.安装必要软件

- sudo apt install mysql-server // 8.x 版本的
  sudo cat /etc/mysql/debian.cnf // 查看 mysql 生成的随机密码
  ```
    # 修改root用户的的密码
    > mysql -u debian-sys-maint -p # 登录mysql
    > show databases;
    > use mysql;
    > update user set authentication_string=PASSWORD("自定义密码") where user='root';
    > update user set plugin="mysql_native_password";
    > flush privileges;
    > quit;
    // mysql 8.0支持的协议规则
    > ALTER USER 'cupboard'@'%' IDENTIFIED WITH mysql_native_password BY 'qwe123123';
  ```
- 修改完密码，需要重启 mysql
  sudo /etc/init.d/mysql restart;

- 安装 nginx

  ```
  sudo apt install nginx
  # 验证是否安装并启动
  sudo systemctl status nginx
  # 开放端口'Nginx Full'包含 80 和 443
  sudo ufw allow 'Nginx Full'
  # 验证端口是否开放
  sudo ufw status


  # 重启nginx
  sudo systemctl restart nginx
  ```
