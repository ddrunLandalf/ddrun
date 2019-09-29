ALTER TABLE erd_order ADD COLUMN order_type int(1) not Null default 0 ;
ALTER TABLE erd_order ADD COLUMN opentp_key varchar(60) default NULL ;

#
# Structure for table "erd_opentp_app"
#

CREATE TABLE `erd_opentp_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_key` varchar(50) NOT NULL DEFAULT '',
  `app_name` varchar(50) NOT NULL DEFAULT '',
  `grant_visit_no` int(11) NOT NULL DEFAULT '0' COMMENT '累计访问次数',
  `ip_white_list` varchar(255) NOT NULL DEFAULT '*' COMMENT 'ip白名单  *表示不限制',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '1.允许访问 2.禁止访问',
  `is_recover` int(1) NOT NULL DEFAULT '0',
  `cb_url` varchar(100) NOT NULL DEFAULT '' COMMENT '回调地址',
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_key` (`app_key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='第三方应用';

# 更新第三方管理权限
INSERT INTO `erd_authority_category` (`cate_name`,`sort`) VALUES ('第三方管理',10);
INSERT INTO `erd_authority` (`cate_id`,`auth_name`,`auth_url`,`auth_type`) VALUES(10,'新增应用','/admin/opentp/add',1),(10,'修改应用','/admin/opentp/upadte',1)
,(10,'修改应用状态','/admin/opentp/status',1),(10,'删除应用','/admin/opentp/recover',1),(10,'获取应用列表','/admin/opentp/list',1);