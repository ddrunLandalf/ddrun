# Host: hapi.ypyzy.top  (Version 5.5.57-log)
# Date: 2019-09-18 12:11:40
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "erd_admin"
#

CREATE TABLE `erd_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(30) NOT NULL DEFAULT '' COMMENT '管理员登录名',
  `admin_pwd` varchar(60) NOT NULL DEFAULT '' COMMENT '登录密码',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '0.禁用 1.启用',
  `is_recover` int(1) NOT NULL DEFAULT '0' COMMENT '是否回收 1.回收 0.恢复',
  `tel_number` varchar(11) DEFAULT NULL COMMENT '手机号',
  `realname` varchar(30) DEFAULT NULL COMMENT '真实姓名',
  `role_id` int(11) NOT NULL DEFAULT '0' COMMENT '角色ID',
  `by_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_name` (`admin_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='管理员';

#
# Data for table "erd_admin"
#

INSERT INTO `erd_admin` VALUES (1,'admin','cduyrlNkV1OKakD/1KsAFw==','2019-08-24 16:30:00',1,0,'17858959662','迪丽热巴',1,NULL);

#
# Structure for table "erd_agent"
#

CREATE TABLE `erd_agent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) NOT NULL DEFAULT '' COMMENT '城市名称',
  `is_serve` int(1) NOT NULL DEFAULT '0' COMMENT '是否开启服务 1.开启 0.暂停',
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `realname` varchar(40) NOT NULL DEFAULT '' COMMENT '真实姓名',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_recover` int(1) NOT NULL DEFAULT '0',
  `cross_city_service` int(1) NOT NULL DEFAULT '0' COMMENT '跨城服务是否开启',
  `surplus_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '余额',
  `grand_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计收益',
  `cash_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计提现',
  PRIMARY KEY (`id`),
  UNIQUE KEY `city_name` (`city_name`),
  UNIQUE KEY `wx_id` (`wx_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='城市代理';

#
# Data for table "erd_agent"
#

INSERT INTO `erd_agent` VALUES (1,'全国',1,0,'','2019-09-15 09:34:14',0,1,0.00,0.00,0.00);

#
# Structure for table "erd_agent_change_log"
#

CREATE TABLE `erd_agent_change_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `agent_id` int(11) NOT NULL DEFAULT '0',
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `realname` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='代理更换日志';

#
# Data for table "erd_agent_change_log"
#


#
# Structure for table "erd_agent_distance_rules"
#

CREATE TABLE `erd_agent_distance_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_id` int(11) NOT NULL DEFAULT '0',
  `start_distance` int(10) NOT NULL DEFAULT '0' COMMENT '起步距离',
  `start_price` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '起步价',
  `exceed_everyone_distance` int(11) NOT NULL DEFAULT '0' COMMENT '超出起步距离 每多少距离加价多少',
  `exceed_everyone_price` double(6,2) NOT NULL DEFAULT '0.00',
  `max_distance` int(11) NOT NULL DEFAULT '0' COMMENT '接受的最大距离',
  `rule_type` varchar(20) NOT NULL DEFAULT '0' COMMENT '帮我送 、帮我取、帮我买、代驾',
  PRIMARY KEY (`id`),
  UNIQUE KEY `agent_id` (`agent_id`,`rule_type`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='路程计价规则表';

#
# Data for table "erd_agent_distance_rules"
#

INSERT INTO `erd_agent_distance_rules` VALUES (1,0,3000,1.00,1000,1.50,3000000,'帮我送'),(2,0,3000,1.00,1000,1.20,3000000,'帮我取'),(3,0,3000,1.00,1000,1.50,3000000,'帮我买'),(4,0,5000,7.00,1000,2.00,5000000,'代驾');

#
# Structure for table "erd_agent_service"
#

CREATE TABLE `erd_agent_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_service` int(1) NOT NULL DEFAULT '0' COMMENT '是否开启服务',
  `buy_meter` float(7,2) DEFAULT '0.00' COMMENT '帮我买 几公里内',
  `init_time` int(11) NOT NULL DEFAULT '0' COMMENT '初始接单时间',
  `platform_profit` int(3) NOT NULL DEFAULT '0' COMMENT '平台收益',
  `agent_profit` int(3) NOT NULL DEFAULT '0' COMMENT '代理收益',
  `user_profit` int(3) NOT NULL DEFAULT '0' COMMENT '用户收益',
  `des_tags` varchar(255) DEFAULT NULL COMMENT '标签',
  `agent_id` int(11) NOT NULL DEFAULT '0' COMMENT '城市代理人 0为不开启城市代理时的设置',
  `service_type` varchar(30) NOT NULL DEFAULT '' COMMENT '服务类型',
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_type` (`service_type`,`agent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='代理服务设置';

#
# Data for table "erd_agent_service"
#

INSERT INTO `erd_agent_service` VALUES (1,1,0.00,15,20,10,70,'文件,小型家居,搬家,小物件,鲜花,蛋糕,衣物,礼品',0,'帮我送'),(2,1,0.00,15,20,10,70,'快递,钥匙,手机,美食外卖,信用卡,邮件',0,'帮我取'),(3,1,0.00,15,25,5,70,'星巴克,肯德基,一点点,德克士,华莱士,五金,超市',0,'帮我买'),(4,1,0.00,5,25,5,70,NULL,0,'代驾');

#
# Structure for table "erd_agent_weight_ruls"
#

CREATE TABLE `erd_agent_weight_ruls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_id` int(11) NOT NULL DEFAULT '0',
  `min_weight` int(11) NOT NULL DEFAULT '0' COMMENT '最小重量 0 g',
  `max_weight` int(11) NOT NULL DEFAULT '0' COMMENT '最大重量',
  `price` double(6,2) NOT NULL DEFAULT '0.00',
  `is_recover` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='重量计价规则';

#
# Data for table "erd_agent_weight_ruls"
#

INSERT INTO `erd_agent_weight_ruls` VALUES (1,0,1,1000,1.00,0);

#
# Structure for table "erd_anlysis_order"
#

CREATE TABLE `erd_anlysis_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_total` int(11) NOT NULL DEFAULT '0' COMMENT '订单总数',
  `complete_total` int(11) NOT NULL DEFAULT '0' COMMENT '完成总数',
  `cancel_total` int(11) NOT NULL DEFAULT '0' COMMENT '取消总数',
  `amount_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '成交总额(包含退款的)',
  `refund_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '退款总额',
  `harvest_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '收获总额',
  `discount_amount_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '优惠券优惠总金额',
  `platform_profit_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '平台总收益',
  `runman_profit_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '跑男总收益',
  `agent_profit_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '代理总收益',
  `data_time` date NOT NULL DEFAULT '0000-00-00' COMMENT '数据日期',
  `growth` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '完成数增长率',
  `growth_amount` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '完成金额增长率',
  `interal_amount_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '积分抵扣总金额',
  `interal_use_number` int(11) NOT NULL DEFAULT '0' COMMENT '积分总使用量',
  `distance_total` int(11) NOT NULL DEFAULT '0' COMMENT '跑男服务总里程',
  `night_price_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '夜间加价总量',
  `weight_price_total` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '重量总金额',
  PRIMARY KEY (`id`),
  UNIQUE KEY `data_time` (`data_time`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='订单数据分析';

#
# Data for table "erd_anlysis_order"
#

INSERT INTO `erd_anlysis_order` VALUES (1,'2019-09-12 18:38:25',123,65,12,654.00,120.00,534.00,1.00,23123.00,113.00,16.00,'2019-09-10',15.00,0.00,1321.00,1562,15,23.00,153.00);

#
# Structure for table "erd_anlysis_wxuser"
#

CREATE TABLE `erd_anlysis_wxuser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_time` date NOT NULL DEFAULT '0000-00-00',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_total` int(11) NOT NULL DEFAULT '0' COMMENT '用户总数',
  `regist_total` int(11) NOT NULL DEFAULT '0' COMMENT '注册用户总数',
  `growth` double(6,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='微信用户数据';

#
# Data for table "erd_anlysis_wxuser"
#

INSERT INTO `erd_anlysis_wxuser` VALUES (1,'2019-09-11','2019-09-13 18:48:00',0,0,0.00);

#
# Structure for table "erd_auth_give"
#

CREATE TABLE `erd_auth_give` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auth_id` int(11) NOT NULL DEFAULT '0',
  `role_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_id` (`auth_id`,`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='赋予权限';

#
# Data for table "erd_auth_give"
#

INSERT INTO `erd_auth_give` VALUES (1,1,1),(2,2,1),(6,9,1),(7,10,1),(8,2,2),(9,6,2),(10,7,2),(11,8,2),(12,9,2),(13,10,2),(33,3,1),(40,4,1),(41,5,1);

#
# Structure for table "erd_authority"
#

CREATE TABLE `erd_authority` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cate_id` int(11) NOT NULL DEFAULT '0',
  `auth_name` varchar(30) NOT NULL DEFAULT '',
  `auth_url` varchar(100) NOT NULL DEFAULT '' COMMENT '路径',
  `auth_type` int(1) NOT NULL DEFAULT '1' COMMENT '权限类型',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='权限';

#
# Data for table "erd_authority"
#
INSERT INTO `erd_authority` (`id`,`cate_id`,`auth_name`,`auth_url`,`create_time`,`auth_type`) VALUES (1,1,'新增管理员','/admin/add','2019-08-26 12:13:15',1),(2,1,'修改管理员信息','/admin/updateMsg','2019-08-26 12:13:45',1),(3,1,'修改管理员状态','/admin/status','2019-08-26 12:14:08',1),(4,1,'回收管理员','/admin/recover','2019-08-26 12:14:47',1),(5,1,'查询管理员列表','/admin/list','2019-08-26 12:15:09',1),(6,2,'添加角色','/role/add','2019-08-26 12:15:34',1),(7,2,'修改角色','/role/update','2019-08-26 12:15:56',1),(8,2,'回收角色','/role/recover','2019-08-26 12:16:32',1),(9,2,'修改角色状态','/role/status','2019-08-26 12:16:43',1),(10,2,'查询角色列表','/role/list','2019-08-26 12:17:30',1),(11,3,'小程序基础信息配置','mwx_page_setting','2019-09-25 09:01:44',2),(12,3,'小程序开发配置','mwx_id_key','2019-09-25 09:02:35',2),(13,3,'微信商户号配置','mwx_mch','2019-09-25 09:03:10',2),(14,3,'服务项配置','service','2019-09-25 09:03:43',2),(15,3,'阿里云短信配置','ali_sms','2019-09-25 09:04:15',2),(16,3,'腾讯地图apikey配置','map_key','2019-09-25 09:04:49',2),(17,3,'新用户获得优惠券设置','coupon_newuser','2019-09-25 09:05:48',2),(18,3,'积分设置','interal','2019-09-25 09:06:19',2),(19,3,'配送时间设置','send_time','2019-09-25 09:07:18',2),(20,3,'配送模式设置','send_mode','2019-09-25 09:07:42',2),(21,3,'取消订单设置','cancel_order','2019-09-25 09:08:13',2),(22,3,'小程序模板消息设置','wxapp_template','2019-09-25 09:08:56',2),(23,3,'分销设置','retail','2019-09-25 09:09:36',2),(24,3,'提现设置','cash','2019-09-25 09:10:43',2),(25,3,'会员设置','vip_set','2019-09-25 09:11:15',2),(26,3,'公众号开发配置','wxp_set','2019-09-25 09:11:44',2),(27,3,'公众号模板消息配置','wxp_template','2019-09-25 09:12:15',2),(28,3,'用户指南','user_pointer','2019-09-25 09:13:30',2),(29,3,'跑男指南','run_pointer','2019-09-25 09:13:53',2),(30,3,'跑男申请协议','run_rules','2019-09-25 09:14:25',2),(31,1,'修改管理员密码','/admin/updatePwd','2019-09-25 09:15:47',1),(32,4,'添加代理','/agent/add','2019-09-25 09:18:29',1),(33,4,'获取代理列表','/agent/list','2019-09-25 09:18:56',1),(34,4,'获取全国','/agent/find','2019-09-25 09:19:22',1),(35,4,'更改服务状态','/agent/serve','2019-09-25 09:19:58',1),(36,4,'更改跨城服务状态','/agent/cross','2019-09-25 09:20:22',1),(37,4,'删除代理','/agent/recover','2019-09-25 09:20:43',1),(38,4,'更换代理','/agent/changeAgent','2019-09-25 09:21:08',1),(39,4,'获取代理信息','/agent/msg','2019-09-25 09:21:30',1),(40,4,'更新服务','/agent/updateService','2019-09-25 09:22:45',1),(41,4,'更新路程','/agent/updateDistance','2019-09-25 09:23:13',1),(42,4,'更新重量','/agent/updateWeight','2019-09-25 09:23:41',1),(43,4,'删除重量','/agent/recoverWeight','2019-09-25 09:24:17',1),(44,4,'新增重量','/agent/newWeight','2019-09-25 09:24:40',1),(45,5,'获取图表数据','/anlysis/overview','2019-09-25 09:25:58',1),(46,5,'订单数据','/anlysis/order','2019-09-25 09:26:20',1),(47,5,'用户总数量数据','/anlysis/userCount','2019-09-25 09:27:01',1),(48,6,'提现审核列表','/cash/list','2019-09-25 09:31:27',1),(49,6,'审核操作','/cash/verify','2019-09-25 09:31:51',1),(50,7,'新增优惠券','/coupon/add','2019-09-25 09:32:04',1),(51,7,'更新优惠券','/coupon/update','2019-09-25 09:34:03',1),(52,7,'获取优惠券列表','/coupon/list','2019-09-25 09:34:33',1),(53,7,'发放优惠券','/coupon/send','2019-09-25 09:36:05',1),(54,8,'上传商户证书','/file/cert','2019-09-25 09:37:32',1),(55,8,'上传图片','/file/img','2019-09-25 09:37:51',1),(56,9,'获取微信用户列表','/wx/user/list','2019-09-25 09:38:27',1),(57,9,'获取跑男及代驾列表','/admin/service/list','2019-09-25 09:40:52',1),(58,9,'获取跑男审核列表','/verify/list','2019-09-25 09:44:14',1),(59,9,'审核操作','/verify/handle','2019-09-25 09:44:51',1),(60,9,'获取操作日志','/verify/log','2019-09-25 09:45:23',1),(61,9,'将用户添加为代驾元','/admin/service/add','2019-09-25 09:47:15',1),(62,9,'指定用户为分销员','/wx/retail/appoint','2019-09-25 09:48:13',1);

#
# Structure for table "erd_authority_category"
#

CREATE TABLE `erd_authority_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(30) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='权限分类';

#
# Data for table "erd_authority_category"
#
INSERT INTO `erd_authority_category` (`id`,`cate_name`,`create_time`,`sort`) VALUES (1,'管理员管理','2019-08-26 12:12:05',1),(2,'角色管理','2019-08-26 12:12:24',2),(3,'配置管理','2019-08-26 12:12:40',3),(4,'代理管理','2019-09-25 09:17:48',4),(5,'数据分析','2019-09-25 09:25:09',5),(6,'提现管理','2019-09-25 09:30:56',6),(7,'优惠券管理','2019-09-25 09:32:38',7),(8,'文件管理','2019-09-25 09:36:56',8),(9,'用户管理','2019-09-25 09:38:41',9);


#
# Structure for table "erd_cash"
#

CREATE TABLE `erd_cash` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` int(1) NOT NULL DEFAULT '0' COMMENT '1.用户 2.跑男 3.代理 4.平台',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `cash_amount` int(11) NOT NULL DEFAULT '0' COMMENT '提现金额',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '0审核中 1成功 2失败',
  `status_season` varchar(100) DEFAULT NULL COMMENT '失败原因',
  `case_type` int(1) NOT NULL DEFAULT '0' COMMENT '1银行卡提现  2.零钱提现',
  `account_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='提现';

#
# Data for table "erd_cash"
#


#
# Structure for table "erd_cash_account"
#

CREATE TABLE `erd_cash_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` int(1) NOT NULL DEFAULT '0' COMMENT '1.用户 2.平台',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `account_name` varchar(60) NOT NULL DEFAULT '' COMMENT '开户行',
  `realname` varchar(50) NOT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_number` varchar(60) NOT NULL DEFAULT '' COMMENT '银行账号',
  `is_recover` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='提现账号';

#
# Data for table "erd_cash_account"
#


#
# Structure for table "erd_config"
#

CREATE TABLE `erd_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) NOT NULL DEFAULT '' COMMENT '标识符',
  `config_content` text,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='配置表';

#
# Data for table "erd_config"
#

INSERT INTO `erd_config` VALUES (2,'mwx_page_setting','{\"navbarTitle\":\"叮点跑腿\",\"navbarFrontColor\":\"#000000\",\"navbarBackColor\":\"#FFFFFF\",\"shareTitle\":\"叮点跑腿\",\"sharePath\":\"/pages/index/index\"}','2019-08-26 18:49:25',NULL),(3,'mwx_id_key','{\"appid\":\"\",\"app_secert\":\"\"}','2019-08-26 19:46:02',NULL),(4,'mwx_mch','{\"mchid\":\"\",\"mch_secert\":\"\",\"apiclient_cert\":\"runtime/cert/4610b3f3-5980-4253-81a2-0801518ab814.p12\",\"apiclient_key\":\"runtime/cert/536b53a9-8fd7-4f70-a8d3-be47887f76aa.pem\",\"notify_url\":\"http://demo.run.landalf.cn/wx/order/findpay\"}','2019-08-27 13:52:44',NULL),(5,'service','{\"open_agent\":0,\"cross_city_service\":0,\"send_service\":1,\"take_service\":1,\"buy_service\":1,\"drive_service\":1,\"appid\":\"3\",\"buy_meter\":\"5\",\"init_send_time\":\"15\",\"init_take_time\":\"15\",\"init_buy_time\":\"20\",\"init_drive_time\":\"5\"}','2019-08-27 18:54:57',NULL),(6,'ali_sms','{\"accessKeyId\":\"\",\"accessKeySecret\":\"\",\"templates\":[],\"signs\":[],\"signName\":\"\",\"verifyTpCode\":\"\"}','2019-08-28 10:54:58',NULL),(7,'map_key','{\"key\":\"\"}','2019-08-29 12:06:19',NULL),(9,'interal','{\"exchange\":\"1000\",\"getInteral\":\"100\",\"max_exchange\":\"0.5\"}','2019-08-30 21:51:42',NULL),(10,'send_time','{\"nightOptons\":[0,1,2,3,4,5,21,22,23],\"nightPrice\":\"2\",\"open_night\":1}','2019-08-31 14:32:31',NULL),(11,'send_mode','{\"mode_type\":2}','2019-09-03 14:33:38',NULL),(12,'cancel_order','{\"freeCancelTime\":\"5\",\"bearCostRate\":\"0.1\",\"userReasons\":[\"我不想送了\",\"地址填错了\",\"配送时间太久了\"],\"runmanReasons\":[\"我不想接这个单\"]}','2019-09-04 13:46:12',NULL),(13,'wxapp_template','{\"templates\":[{\"id\":\"AT0257\",\"keywords\":\"订单状态、订单号、完成时间、订单金额\",\"templateId\":\"_AMW26pY_uG2FPFIEYI3B2pcwIcYBBQwl5H5s9lsFl4\",\"title\":\"订单完成通知\"},{\"id\":\"AT1853\",\"keywords\":\"订单类型、订单编号、配送地址、配送人员\",\"templateId\":\"74i4HLS8mxaUFp-ojjriwcPZSwDiTWSc4607h48AfXw\",\"title\":\"配送完成通知\"},{\"id\":\"AT0177\",\"keywords\":\"配送状态、订单编号、下单时间、配送地址、配送员\",\"templateId\":\"XnIBMacIJKR_7F6j4YuxjhvamNMCrr_-FRG9iaRBs9o\",\"title\":\"订单配送通知\"},{\"id\":\"AT0024\",\"keywords\":\"订单编号、订单退款、取消原因、取消人\",\"templateId\":\"HUoEOk8ICvFE7Pg51Iqn6Z7_SYjdwV3LKFIukXRMVT8\",\"title\":\"订单取消通知\"},{\"id\":\"AT0146\",\"keywords\":\"审核结果、拒绝理由\",\"templateId\":\"PAkbHwMwihArUlzVjk3H_kdURzRSuzwx7se_K_nOCbI\",\"title\":\"审核结果通知\"}]}','2019-09-05 17:24:48',NULL),(15,'cash','{\"cash_type\":1,\"cash_time\":1,\"cash_number\":\"1\",\"run_min_cash\":\"0.3\",\"run_max_cash\":\"1000\",\"user_min_cash\":\"100\",\"user_max_cash\":\"1000\",\"agent_min_cash\":\"0.3\",\"agent_max_cash\":\"1000\"}','2019-09-08 18:55:16',NULL),(19,'user_pointer','<p>1.吧v和世界杯空间和司法会计上帝就发是立刻搭街坊</p><p>2.给您办理方式的客户明白了开挂反对吗；理发店</p><p>3.收费公路两个凡是的话了回来了杠六十多个力度</p><p>4.十六个， 的两个反动势力了了了给上的裂缝的旅客离开东莞佛山的风格岁的法国丰大概</p><p>v发的美丽dfsg fsd给</p><p>fsd给</p><p>的fg士大夫</p><p>gds发gf是德国</p><p><br></p><p>ff是德国</p><p>f是德国</p><p><br></p><p>ssdfg 岁的法国士大夫感到附属国事返点gfsd给</p><p>sdfg sdf给</p><p>dfs给</p><p>发生的广泛大使馆夫是德国夫是德国夫是德国夫是德国夫是德国</p>','2019-09-12 01:15:08',NULL),(20,'run_pointer','<p>发达国家哦dlkjfdslgk</p><p>第三个路口即使对方国家领导反馈</p><p>对法轮功jlfksjg东法兰克感觉lsdf</p><p>的风格近年来发生的给对方</p>','2019-09-12 01:15:59',NULL),(21,'run_rules','<p>士大夫事故发生的旅客那辆发狂的礼服款式的g</p><p>对法轮功看吉林省的风格；浪费口水的g大发牢骚的</p><p>给开发商的旅客的风格来看丰大概</p><p>对方是个放声大哭格兰芬多的风格广泛的沙发电视柜</p>','2019-09-12 01:17:32',NULL);

#
# Structure for table "erd_menu"
#

CREATE TABLE `erd_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(30) NOT NULL DEFAULT '',
  `menu_path` varchar(50) NOT NULL DEFAULT '' COMMENT '跳转路径',
  `menu_sub` tinytext NOT NULL COMMENT '子菜单',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_recover` int(1) NOT NULL DEFAULT '0' COMMENT '是否回收 1.回收 0.恢复',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='菜单';

#
# Data for table "erd_menu"
#


#
# Structure for table "erd_order"
#

CREATE TABLE `erd_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(60) NOT NULL DEFAULT '' COMMENT '订单编号',
  `pay_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `pay_type` int(1) NOT NULL DEFAULT '0' COMMENT '1微信支付 2.第三方支付',
  `wxcoupon_id` int(11) NOT NULL DEFAULT '0' COMMENT '优惠券ID',
  `discount_amount` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `service_type` varchar(30) NOT NULL DEFAULT '' COMMENT '服务类型',
  `interal_value` int(11) NOT NULL DEFAULT '0' COMMENT '使用的积分值',
  `interal_amount` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '低分抵扣金额',
  `night_price` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '夜间配送金额',
  `start_distance_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '起步路程费用',
  `exceed_distance_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '超出部分路程费用',
  `exceed_distance` int(11) NOT NULL DEFAULT '0' COMMENT '超出路程多少',
  `weight_id` int(11) NOT NULL DEFAULT '0',
  `weight_price` double(6,2) NOT NULL DEFAULT '0.00' COMMENT '重量费用',
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '-2取消订单  -1交易关闭 0.待付款  1.已支付/待接单  2.已接单/配送中 3.配送完成/待确认  4.确认完成',
  `refund_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '退款金额',
  `refund_status` int(1) NOT NULL DEFAULT '0' COMMENT '0.未发起退款  1.已退款',
  `start_address` text NOT NULL,
  `end_address` text NOT NULL,
  `goods_des` varchar(255) NOT NULL DEFAULT '' COMMENT '物品描述',
  `send_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '发货时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `form_ids` varchar(200) NOT NULL DEFAULT '',
  `openid` varchar(60) NOT NULL DEFAULT '',
  `tip` int(11) NOT NULL DEFAULT '0' COMMENT '小费',
  `distance` int(11) NOT NULL DEFAULT '0' COMMENT '路程',
  `ws_id` int(11) NOT NULL DEFAULT '0',
  `refund_no` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COMMENT='订单';

#
# Data for table "erd_order"
#


#
# Structure for table "erd_order_cents"
#

CREATE TABLE `erd_order_cents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profit_p` double(10,2) NOT NULL DEFAULT '0.00' COMMENT '平台收益',
  `profit_a` double(10,2) NOT NULL DEFAULT '0.00' COMMENT '代理收益',
  `profit_m` double(10,2) NOT NULL DEFAULT '0.00' COMMENT '跑男收益',
  `profit_fu` double(8,2) NOT NULL DEFAULT '0.00' COMMENT '一级用户收益',
  `profit_su` double(8,2) NOT NULL DEFAULT '0.00' COMMENT '二级用户收益',
  `order_id` int(11) NOT NULL DEFAULT '0',
  `agent_id` int(11) NOT NULL DEFAULT '0',
  `ws_id` int(11) NOT NULL DEFAULT '0' COMMENT '跑男id',
  `fu_id` int(11) NOT NULL DEFAULT '0' COMMENT '一级用户id',
  `su_id` int(11) NOT NULL DEFAULT '0' COMMENT '二级用户id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='订单分成';

#
# Data for table "erd_order_cents"
#


#
# Structure for table "erd_order_evaluate"
#

CREATE TABLE `erd_order_evaluate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT '0',
  `ws_id` int(11) NOT NULL DEFAULT '0',
  `score` int(1) NOT NULL DEFAULT '0' COMMENT '服务态度',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `oe_type` int(1) NOT NULL DEFAULT '0' COMMENT '1.匿名评价 2.实名评价',
  `msg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='订单评价';

#
# Data for table "erd_order_evaluate"
#


#
# Structure for table "erd_order_ope"
#

CREATE TABLE `erd_order_ope` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT '0',
  `status_time1` timestamp NULL DEFAULT NULL,
  `status_time2` timestamp NULL DEFAULT NULL,
  `status_time3` timestamp NULL DEFAULT NULL,
  `status_time4` timestamp NULL DEFAULT NULL,
  `status_time1_` timestamp NULL DEFAULT NULL,
  `status_time2_` timestamp NULL DEFAULT NULL,
  `refund_time` timestamp NULL DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ope_type4` int(1) NOT NULL DEFAULT '0' COMMENT '确认人 1.用户 2.跑男 3.平台',
  `ope_type2_` int(1) NOT NULL DEFAULT '0' COMMENT '取消订单的人 1.用户 2.跑男 3.平台',
  `refund_reason` varchar(50) DEFAULT '' COMMENT '退款理由',
  `refund_fine` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '罚款',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COMMENT='订单操作表';

#
# Data for table "erd_order_ope"
#


#
# Structure for table "erd_phone"
#

CREATE TABLE `erd_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(11) NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_type` int(1) NOT NULL DEFAULT '0' COMMENT '1.管理员  2.微信小程序用户',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`,`user_id`,`user_type`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='手机号';

#
# Data for table "erd_phone"
#


#
# Structure for table "erd_phone_code"
#

CREATE TABLE `erd_phone_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(6) NOT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `phone_number` varchar(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='短信验证码';

#
# Data for table "erd_phone_code"
#


#
# Structure for table "erd_phone_log"
#

CREATE TABLE `erd_phone_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` int(1) NOT NULL DEFAULT '0' COMMENT '1.管理员 2.微信用户',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `op_type` int(1) NOT NULL DEFAULT '0' COMMENT '操作类型 1.绑定 2.更换绑定',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phone_number` varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='手机号绑定日志';

#
# Data for table "erd_phone_log"
#


#
# Structure for table "erd_recover"
#

CREATE TABLE `erd_recover` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rec_type` varchar(50) NOT NULL DEFAULT '' COMMENT '回收类型',
  `rec_des` varchar(50) NOT NULL DEFAULT '' COMMENT '回收名称',
  `from_table` varchar(50) NOT NULL DEFAULT '' COMMENT '属于哪个表',
  `key_id` int(11) NOT NULL DEFAULT '0' COMMENT '主键值',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_resume` int(1) NOT NULL DEFAULT '0' COMMENT '是否复原 1已复原 0未复原 2彻底删除',
  `resume_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='回收站';

#
# Data for table "erd_recover"
#


#
# Structure for table "erd_role"
#

CREATE TABLE `erd_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL DEFAULT '' COMMENT '角色名',
  `remarks` varchar(50) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '1可用2禁用',
  `sort` int(11) DEFAULT NULL,
  `by_user_id` int(11) NOT NULL DEFAULT '0',
  `is_recover` int(1) NOT NULL DEFAULT '0' COMMENT '是否回收 1.回收 0.恢复',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='角色';

#
# Data for table "erd_role"
#

INSERT INTO `erd_role` VALUES (1,'管理员','高浮雕鬼地方','2019-08-25 22:46:25',1,1,1,0),(2,'财务','士大夫','2019-08-25 22:51:52',1,2,1,0),(3,'白痴','1','2019-08-25 22:53:55',0,3,1,1),(4,'狗比','五七二','2019-08-25 22:56:02',0,4,1,0);

#
# Structure for table "erd_wxapp_address"
#

CREATE TABLE `erd_wxapp_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formatted_addresse` varchar(100) NOT NULL DEFAULT '' COMMENT '地址显示标题',
  `province` varchar(40) NOT NULL DEFAULT '',
  `city` varchar(40) NOT NULL DEFAULT '',
  `district` varchar(40) NOT NULL DEFAULT '',
  `latitude` double(14,10) NOT NULL DEFAULT '0.0000000000' COMMENT '纬度',
  `longitude` double(14,10) NOT NULL DEFAULT '0.0000000000',
  `phone` varchar(11) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT '',
  `street_number` varchar(40) DEFAULT NULL COMMENT '街道门牌',
  `address_detail` varchar(255) DEFAULT '' COMMENT '详细描述地址',
  `recent_use` datetime DEFAULT NULL,
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COMMENT='微信用户地址';

#
# Data for table "erd_wxapp_address"
#


#
# Structure for table "erd_wxapp_login_log"
#

CREATE TABLE `erd_wxapp_login_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(50) NOT NULL DEFAULT '',
  `session_key` varchar(60) NOT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COMMENT='小程序登陆日志';

#
# Data for table "erd_wxapp_login_log"
#


#
# Structure for table "erd_wxapp_service"
#

CREATE TABLE `erd_wxapp_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realname` varchar(35) NOT NULL DEFAULT '' COMMENT '真实姓名',
  `id_number` varchar(18) NOT NULL DEFAULT '' COMMENT '身份证号码',
  `start_date` date DEFAULT NULL COMMENT '身份证有效期',
  `end_date` date DEFAULT NULL,
  `card_z_img` varchar(255) DEFAULT '' COMMENT '身份证正面',
  `card_f_img` varchar(255) DEFAULT '' COMMENT '身份证反面',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '0.审核中 1.拒绝  2.过审/正常服务 3.停止服务 4.停止服务并冻结账户',
  `take_mode` int(1) NOT NULL DEFAULT '0' COMMENT '2.自动接单 1.开启手动接单模式 0.关闭 不接单',
  `surplus_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '余额',
  `cumulative_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计金额',
  `cash_amount` int(11) NOT NULL DEFAULT '0' COMMENT '提现金额',
  `form_id` varchar(50) NOT NULL DEFAULT '' COMMENT '表单id',
  `wx_id` int(11) NOT NULL DEFAULT '0',
  `fine_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计罚款',
  `score` double(3,1) NOT NULL DEFAULT '5.0' COMMENT '评分  每月更新',
  `ws_type` int(1) NOT NULL DEFAULT '1' COMMENT '1跑男 2代驾',
  `is_notice` int(1) NOT NULL DEFAULT '1' COMMENT '1是 0.否   是否开启接单提醒',
  PRIMARY KEY (`id`),
  KEY `id_number` (`id_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='成为服务者';

#
# Data for table "erd_wxapp_service"
#


#
# Structure for table "erd_wxapp_service_verify"
#

CREATE TABLE `erd_wxapp_service_verify` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ws_id` int(11) NOT NULL DEFAULT '0' COMMENT '跑男id',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '1.拒绝 2.通过',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `refuse_des` varchar(100) DEFAULT NULL COMMENT '拒绝原因',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='跑男审核';

#
# Data for table "erd_wxapp_service_verify"
#


#
# Structure for table "erd_wxapp_user"
#

CREATE TABLE `erd_wxapp_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(60) NOT NULL DEFAULT '',
  `nick_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `gender` int(1) DEFAULT '0',
  `province` varchar(40) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '1.可用 0.封号',
  `home_address_id` int(11) DEFAULT NULL COMMENT '家的地址',
  `company_address_id` int(11) DEFAULT NULL,
  `surplus_integral` int(11) NOT NULL DEFAULT '0' COMMENT '剩余积分',
  `grand_integral` int(11) NOT NULL DEFAULT '0' COMMENT '累计积分',
  `grand_fee` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计消费',
  `grand_cash` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计提现',
  `grand_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计佣金',
  `surplus_amount` double(12,2) NOT NULL DEFAULT '0.00' COMMENT '佣金余额',
  `f_no` int(11) NOT NULL DEFAULT '0' COMMENT '一级用户数',
  `s_no` int(11) NOT NULL DEFAULT '0' COMMENT '二级用户数',
  `qr_code` varchar(255) DEFAULT NULL COMMENT '我的推广码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='微信小程序用户';

#
# Data for table "erd_wxapp_user"
#

INSERT INTO `erd_wxapp_user` VALUES (1,'onVC15CntPlNlXZyVxxwQJubmt5s','Landalf','https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL1BpUSPDuTFUspib80XQPibKeGAWhu6sltbEtwKGHibM1ThldXYXke9PMarFU4hI693c1aQRu9ibMN9w/132',1,'浙江','湖州','2019-08-27 14:07:08',1,6,7,3800,5600,60.00,1614.00,0.02,2014.02,1,0,'static/qrcode/2e5659cf-9e1f-40d7-828e-0f130089ee7f.png');

#
# View "erd_v_order_list"
#

CREATE
  ALGORITHM = UNDEFINED
  VIEW `erd_v_order_list`
  AS
  SELECT
    `erd_order`.`id`,
    `erd_order`.`order_no`,
    `erd_order`.`pay_amount`,
    `erd_order`.`pay_type`,
    `erd_order`.`wxcoupon_id`,
    `erd_order`.`discount_amount`,
    `erd_order`.`service_type`,
    `erd_order`.`interal_value`,
    `erd_order`.`interal_amount`,
    `erd_order`.`night_price`,
    `erd_order`.`start_distance_amount`,
    `erd_order`.`exceed_distance_amount`,
    `erd_order`.`exceed_distance`,
    `erd_order`.`weight_id`,
    `erd_order`.`weight_price`,
    `erd_order`.`status`,
    `erd_order`.`refund_amount`,
    `erd_order`.`refund_status`,
    `erd_order`.`start_address`,
    `erd_order`.`end_address`,
    `erd_order`.`goods_des`,
    `erd_order`.`send_time`,
    `erd_order`.`create_time`,
    `erd_order`.`wx_id`,
    `erd_order`.`form_ids`,
    `erd_order`.`openid`,
    `erd_order`.`tip`,
    `erd_order`.`distance`,
    `erd_order`.`ws_id`,
    `erd_order`.`refund_no`,
    `ope`.`status_time1`,
    `ope`.`status_time2`,
    `ope`.`status_time3`,
    `ope`.`status_time4`,
    `ope`.`status_time1_`,
    `ope`.`status_time2_`,
    `ope`.`refund_time`,
    `ope`.`ope_type4`,
    `ope`.`ope_type2_`,
    `ope`.`refund_reason`,
    `ope`.`refund_fine`
  FROM
    (`erd_order`
      JOIN `erd_order_ope` ope)
  WHERE
    (`erd_order`.`id` = `ope`.`order_id`)
  ORDER BY `erd_order`.`create_time` DESC;
