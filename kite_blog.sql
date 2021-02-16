/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : localhost:3306
 Source Schema         : kite_blog

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : 65001

 Date: 16/02/2021 16:43:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for k_article
-- ----------------------------
DROP TABLE IF EXISTS `k_article`;
CREATE TABLE `k_article`  (
  `a_id` int(11) NOT NULL AUTO_INCREMENT,
  `a_title` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `a_content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `a_createdate` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `a_updatedate` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `a_viewcount` int(11) NOT NULL DEFAULT 0,
  `a_likecount` int(11) NOT NULL DEFAULT 0,
  `a_banner` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `a_status` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'pending',
  `a_reject_remark` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `u_id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `a_type` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'normal',
  `a_markdown` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `a_modifier_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`a_id`) USING BTREE,
  INDEX `fk_article_article_1`(`u_id`) USING BTREE,
  INDEX `fk_article_article_2`(`cat_id`) USING BTREE,
  INDEX `fk_article_modifier_id`(`a_modifier_id`) USING BTREE,
  CONSTRAINT `fk_article_article_1` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_article_article_2` FOREIGN KEY (`cat_id`) REFERENCES `k_category` (`cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_article_modifier_id` FOREIGN KEY (`a_modifier_id`) REFERENCES `k_user` (`u_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 147 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_article
-- ----------------------------
INSERT INTO `k_article` VALUES (145, 'Node天下无敌！', '<p>Node天下无敌！</p>\n', '2021-01-21 19:41:29', '2021-01-21 19:41:29', 0, 0, NULL, 'pending', NULL, 14, 275, 'normal', 'Node天下无敌！', NULL);
INSERT INTO `k_article` VALUES (146, '模板模板模板！', '<p>模板模板模板！</p>\n', '2021-01-21 19:44:23', '2021-01-21 19:44:23', 0, 0, NULL, 'pending', NULL, 14, 1935, 'normal', '模板模板模板！', NULL);

-- ----------------------------
-- Table structure for k_article_category_relationship
-- ----------------------------
DROP TABLE IF EXISTS `k_article_category_relationship`;
CREATE TABLE `k_article_category_relationship`  (
  `acr_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_id` int(11) NOT NULL,
  `a_id` int(11) NOT NULL,
  PRIMARY KEY (`acr_id`) USING BTREE,
  INDEX `fk_d_article_catorgery_relationship_d_article_catorgery_relatio1`(`a_id`) USING BTREE,
  INDEX `fk_d_article_catorgery_relationship_d_article_catorgery_relatio2`(`cat_id`) USING BTREE,
  CONSTRAINT `fk_d_article_catorgery_relationship_d_article_catorgery_relatio1` FOREIGN KEY (`a_id`) REFERENCES `k_article` (`a_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_d_article_catorgery_relationship_d_article_catorgery_relatio2` FOREIGN KEY (`cat_id`) REFERENCES `k_category` (`cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 117 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_article_category_relationship
-- ----------------------------
INSERT INTO `k_article_category_relationship` VALUES (115, 275, 145);
INSERT INTO `k_article_category_relationship` VALUES (116, 1935, 146);

-- ----------------------------
-- Table structure for k_category
-- ----------------------------
DROP TABLE IF EXISTS `k_category`;
CREATE TABLE `k_category`  (
  `cat_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `cat_parentid` int(11) NULL DEFAULT 0,
  `cat_type` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'category',
  `cat_order` int(11) NOT NULL DEFAULT 1,
  `cat_description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cat_level` smallint(1) NOT NULL DEFAULT 1,
  `cat_status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cat_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1938 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_category
-- ----------------------------
INSERT INTO `k_category` VALUES (275, '前端', 0, 'article', 3, NULL, 1, 1);
INSERT INTO `k_category` VALUES (276, '后端', 0, 'article', 2, NULL, 1, 1);
INSERT INTO `k_category` VALUES (277, 'HTML', 275, 'article', 1, NULL, 2, 1);
INSERT INTO `k_category` VALUES (278, 'CSS', 275, 'article', 2, NULL, 2, 1);
INSERT INTO `k_category` VALUES (279, 'JavaScript', 275, 'article', 3, NULL, 2, 1);
INSERT INTO `k_category` VALUES (280, 'NodeJS', 275, 'article', 4, NULL, 2, 1);
INSERT INTO `k_category` VALUES (283, 'Less', 278, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (284, 'Sass', 278, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (285, 'JQuery', 279, 'article', 6, NULL, 3, 1);
INSERT INTO `k_category` VALUES (286, 'Zepto', 279, 'article', 7, NULL, 3, 1);
INSERT INTO `k_category` VALUES (287, 'TypeScript', 279, 'article', 5, NULL, 3, 1);
INSERT INTO `k_category` VALUES (288, 'Vue', 279, 'article', 2, NULL, 3, 1);
INSERT INTO `k_category` VALUES (289, 'React', 279, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (290, 'Angular', 279, 'article', 3, NULL, 3, 1);
INSERT INTO `k_category` VALUES (291, 'uni-app', 279, 'article', 4, NULL, 3, 1);
INSERT INTO `k_category` VALUES (292, 'Express', 280, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (293, 'Egg', 280, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (294, 'Java', 276, 'article', 1, NULL, 2, 1);
INSERT INTO `k_category` VALUES (299, 'Spring MVC', 294, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (300, 'Spring Boot', 294, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (301, 'Spring Cloud', 294, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (302, 'Mybatis', 294, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (303, '今天学到了', 0, 'hotpoint', 3, NULL, 1, 1);
INSERT INTO `k_category` VALUES (1901, '21312', 277, 'article', 1, NULL, 3, 1);
INSERT INTO `k_category` VALUES (1931, '上班摸鱼', 0, 'hotpoint', 1, NULL, 1, 1);
INSERT INTO `k_category` VALUES (1932, '内推招聘', 0, 'hotpoint', 1, NULL, 1, 1);
INSERT INTO `k_category` VALUES (1935, '驳回模板', 0, 'template', 1, NULL, 1, 0);
INSERT INTO `k_category` VALUES (1937, '回复模板', 0, 'template', 1, NULL, 1, 1);

-- ----------------------------
-- Table structure for k_cms_user
-- ----------------------------
DROP TABLE IF EXISTS `k_cms_user`;
CREATE TABLE `k_cms_user`  (
  `cms_u_id` int(11) NOT NULL AUTO_INCREMENT,
  `cms_u_name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `cms_u_password` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `cms_u_role` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'superadmin',
  `cms_u_avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `cms_u_createdate` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `cms_u_job_no` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `u_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`cms_u_id`) USING BTREE,
  INDEX `fk_admin_user_uid`(`u_id`) USING BTREE,
  CONSTRAINT `fk_admin_user_uid` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_cms_user
-- ----------------------------
INSERT INTO `k_cms_user` VALUES (1, 'Kite1874', '123123', 'superadmin', NULL, '2021-01-21 19:39:13', '100000001', 14);
INSERT INTO `k_cms_user` VALUES (14, '傻傻的管理员', '123123', 'admin', NULL, '2021-01-21 19:46:18', '000001', 15);
INSERT INTO `k_cms_user` VALUES (15, '看到眼睛流脓的审核员', '123123', 'auditor', NULL, '2021-01-21 19:46:27', '000002', 16);
INSERT INTO `k_cms_user` VALUES (16, '无情的码字机器', '123123', 'editor', NULL, '2021-01-21 19:46:33', '000003', 17);
INSERT INTO `k_cms_user` VALUES (17, '打酱油专业户', '123123', 'visitor', NULL, '2021-01-21 19:46:39', '000004', 18);

-- ----------------------------
-- Table structure for k_comment
-- ----------------------------
DROP TABLE IF EXISTS `k_comment`;
CREATE TABLE `k_comment`  (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `c_date` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `c_like` int(11) NULL DEFAULT NULL,
  `c_parent_id` int(11) NULL DEFAULT NULL,
  `u_id` int(11) NOT NULL,
  `a_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`c_id`) USING BTREE,
  INDEX `fk_d_comment_d_comment_1`(`u_id`) USING BTREE,
  INDEX `fk_comment_article_aid`(`a_id`) USING BTREE,
  CONSTRAINT `fk_comment_article_aid` FOREIGN KEY (`a_id`) REFERENCES `k_article` (`a_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_d_comment_d_comment_1` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for k_favorites
-- ----------------------------
DROP TABLE IF EXISTS `k_favorites`;
CREATE TABLE `k_favorites`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) NOT NULL,
  `a_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_d_favorites_d_favorites_2`(`a_id`) USING BTREE,
  INDEX `fk_d_favorites_d_favorites_1`(`u_id`) USING BTREE,
  CONSTRAINT `fk_d_favorites_d_favorites_1` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_d_favorites_d_favorites_2` FOREIGN KEY (`a_id`) REFERENCES `k_article` (`a_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for k_follow
-- ----------------------------
DROP TABLE IF EXISTS `k_follow`;
CREATE TABLE `k_follow`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) NOT NULL,
  `f_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_d_follow_d_follow_1`(`u_id`) USING BTREE,
  CONSTRAINT `fk_d_follow_d_follow_1` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for k_hot_point
-- ----------------------------
DROP TABLE IF EXISTS `k_hot_point`;
CREATE TABLE `k_hot_point`  (
  `hp_id` int(11) NOT NULL AUTO_INCREMENT,
  `hp_content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hp_pictrue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `hp_createdate` datetime(0) NOT NULL,
  `hp_status` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'normal',
  `hp_like` int(11) NOT NULL DEFAULT 0,
  `hp_type` varchar(16) CHARACTER SET utf8 COLLATE utf8_estonian_ci NULL DEFAULT NULL,
  `hp_reject_remark` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cat_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  PRIMARY KEY (`hp_id`) USING BTREE,
  INDEX `fk_hp_user_uid`(`u_id`) USING BTREE,
  INDEX `fk_hp_category_catid`(`cat_id`) USING BTREE,
  CONSTRAINT `fk_hp_category_catid` FOREIGN KEY (`cat_id`) REFERENCES `k_category` (`cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hp_user_uid` FOREIGN KEY (`u_id`) REFERENCES `k_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12254 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_hot_point
-- ----------------------------
INSERT INTO `k_hot_point` VALUES (12253, '若你喜欢怪人，其实我很美', NULL, '2021-01-21 19:42:45', 'normal', 0, 'recommend', NULL, 303, 14);

-- ----------------------------
-- Table structure for k_hp_category_relationship
-- ----------------------------
DROP TABLE IF EXISTS `k_hp_category_relationship`;
CREATE TABLE `k_hp_category_relationship`  (
  `hpc_id` int(11) NOT NULL AUTO_INCREMENT,
  `hp_id` int(11) NULL DEFAULT NULL,
  `cat_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`hpc_id`) USING BTREE,
  INDEX `fk_hp_cate_cat_id`(`cat_id`) USING BTREE,
  INDEX `fk_hp_cate_hp_id`(`hp_id`) USING BTREE,
  CONSTRAINT `fk_hp_cate_cat_id` FOREIGN KEY (`cat_id`) REFERENCES `k_category` (`cat_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hp_cate_hp_id` FOREIGN KEY (`hp_id`) REFERENCES `k_hot_point` (`hp_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12252 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_hp_category_relationship
-- ----------------------------
INSERT INTO `k_hp_category_relationship` VALUES (12251, 12253, 303);

-- ----------------------------
-- Table structure for k_hp_comment
-- ----------------------------
DROP TABLE IF EXISTS `k_hp_comment`;
CREATE TABLE `k_hp_comment`  (
  `hpc_id` int(11) NOT NULL,
  `hpc_comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hpc_like` int(255) NOT NULL,
  `hpc_createdate` datetime(0) NOT NULL,
  `hpc_parent_id` int(11) NULL DEFAULT NULL,
  `hp_id` int(11) NOT NULL,
  PRIMARY KEY (`hpc_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for k_like
-- ----------------------------
DROP TABLE IF EXISTS `k_like`;
CREATE TABLE `k_like`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `type` smallint(6) NOT NULL,
  `u_id` int(11) NOT NULL,
  `status` smallint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for k_router
-- ----------------------------
DROP TABLE IF EXISTS `k_router`;
CREATE TABLE `k_router`  (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `r_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `r_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `r_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `r_affix` tinyint(6) NOT NULL DEFAULT 0,
  `r_roles` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `r_icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `r_nocache` tinyint(6) NOT NULL DEFAULT 0,
  `r_redirect` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `r_component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `r_parentid` int(11) NOT NULL DEFAULT 0,
  `r_order` int(11) NOT NULL DEFAULT 1,
  `r_level` int(11) NOT NULL DEFAULT 1,
  `r_is_external` tinyint(1) NULL DEFAULT NULL,
  `r_target` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`r_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_router
-- ----------------------------
INSERT INTO `k_router` VALUES (1, 'user', 'User', '用户管理', 0, 'superadmin,admin', 'el-icon-user', 1, '', 'Main', 0, 2, 1, NULL, '_self');
INSERT INTO `k_router` VALUES (3, 'hotPoint', 'HotPoint', '沸点管理', 0, 'superadmin,admin,editor', 'el-icon-chat-square', 1, NULL, 'HotPoint', 0, 4, 1, NULL, '_self');
INSERT INTO `k_router` VALUES (4, 'template', 'Template', '模板管理', 0, 'superadmin,admin,editor', 'el-icon-document-copy', 1, NULL, 'Template', 0, 5, 1, NULL, '_self');
INSERT INTO `k_router` VALUES (5, 'category', 'Category', '分类管理', 0, 'superadmin,admin', 'el-icon-menu', 1, NULL, 'Main', 0, 6, 1, NULL, '_self');
INSERT INTO `k_router` VALUES (6, 'articleCategory', 'ArticleCategory', '文章分类', 0, 'superadmin,admin', '', 1, NULL, 'ArticleCategory', 5, 1, 2, NULL, '_self');
INSERT INTO `k_router` VALUES (7, 'hotPointCategory', 'HotPointCategory', '沸点分类', 0, 'superadmin,admin', NULL, 1, NULL, 'HotPointCategory', 5, 2, 2, NULL, '_self');
INSERT INTO `k_router` VALUES (8, 'templateCategory', 'TemplateCategory', '模板分类', 0, 'superadmin,admin', NULL, 1, NULL, 'TemplateCategory', 5, 3, 2, NULL, '_self');
INSERT INTO `k_router` VALUES (9, 'editor', 'Editor', '编辑器', 0, 'superadmin,admin,editor', 'el-icon-edit', 1, NULL, 'Editor', 0, 7, 1, NULL, '_self');
INSERT INTO `k_router` VALUES (10, 'dashboard', 'Dashboard', 'Dashboard', 1, 'superadmin,admin,editor', 'el-icon-odometer', 1, NULL, 'Dashboard', 0, 1, 1, 0, '_self');
INSERT INTO `k_router` VALUES (11, 'user_toc', 'UserToC', 'ToC用户', 0, 'superadmin,admin', NULL, 1, NULL, 'UserToC', 1, 1, 2, 0, '_self');
INSERT INTO `k_router` VALUES (12, 'user_cms', 'UserCMS', 'CMS用户', 0, 'superadmin', NULL, 1, NULL, 'UserCMS', 1, 2, 2, NULL, '_self');
INSERT INTO `k_router` VALUES (13, 'permission', 'Permission', '权限管理', 0, 'superadmin', 'el-icon-lock', 1, NULL, 'Main', 0, 1, 1, 0, '_self');
INSERT INTO `k_router` VALUES (14, 'routerconfig', 'RouterConfig', '路由权限配置', 0, 'superadmin', '', 1, NULL, 'RouterConfig', 13, 1, 2, 0, '_self');
INSERT INTO `k_router` VALUES (16, 'document', 'Document', '项目文档', 0, 'superadmin', 'el-icon-document', 1, NULL, 'Document', 0, 9999, 1, 0, '_self');

-- ----------------------------
-- Table structure for k_user
-- ----------------------------
DROP TABLE IF EXISTS `k_user`;
CREATE TABLE `k_user`  (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `u_password` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `u_role` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'normal',
  `u_sex` smallint(1) NOT NULL DEFAULT 0,
  `u_avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `u_status` smallint(1) NOT NULL DEFAULT 0,
  `u_createdate` datetime(0) NOT NULL,
  `u_email` varchar(320) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `u_phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`u_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of k_user
-- ----------------------------
INSERT INTO `k_user` VALUES (14, 'Kite1874', '123123', 'tocms', 0, NULL, 0, '2021-01-21 19:18:53', 'kite1874@1874.com', '19999999999');
INSERT INTO `k_user` VALUES (15, '傻傻的管理员', '123123', 'tocms', 0, NULL, 0, '2021-01-21 19:27:48', 'kite18741998@163.com', NULL);
INSERT INTO `k_user` VALUES (16, '看到眼睛流脓的审核员', '123123', 'tocms', 0, NULL, 0, '2021-01-21 19:28:32', '000002@1874.com', NULL);
INSERT INTO `k_user` VALUES (17, '无情的码字机器', '123123', 'tocms', 0, NULL, 0, '2021-01-21 19:28:57', '000003@163.com', NULL);
INSERT INTO `k_user` VALUES (18, '打酱油专业户', '123123', 'tocms', 0, NULL, 0, '2021-01-21 19:29:52', '000004@1874.com', NULL);
INSERT INTO `k_user` VALUES (19, '我是一个普通到不能再普通的用户', '1231223', 'normal', 0, NULL, 1, '2021-01-21 19:45:44', 'kite123@123.com', NULL);

-- ----------------------------
-- Procedure structure for aa
-- ----------------------------
DROP PROCEDURE IF EXISTS `aa`;
delimiter ;;
CREATE PROCEDURE `aa`()
begin
declare i int;
SET i = 20;
	WHILE
			i < 200 DO
			INSERT INTO `d_user` ( u_name, u_role, u_password, u_sex, u_icon )
		VALUES
			( CONCAT( 'kitee', i ), '0', '123456', '男', NULL );
		
		SET i = i + 1;
		
	END WHILE;
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for test
-- ----------------------------
DROP PROCEDURE IF EXISTS `test`;
delimiter ;;
CREATE PROCEDURE `test`()
begin
    declare i int;                      #申明变量
    set i = 1933;                          #变量赋值
    while i <= 12242 do                     #结束循环的条件: 当i大于10时跳出while循环
        INSERT INTO k_hp_category_relationship (hp_id, cat_id) VALUES(i, 1932);    #往test表添加数据
        set i = i + 1;                  #循环一次,i加一
    end while;                          #结束while循环
end
;;
delimiter ;

-- ----------------------------
-- Function structure for tree_child_lists
-- ----------------------------
DROP FUNCTION IF EXISTS `tree_child_lists`;
delimiter ;;
CREATE FUNCTION `tree_child_lists`(root_id int)
 RETURNS varchar(1000) CHARSET utf8mb4
begin
 
    declare temp varchar(1000);
    declare temp_char varchar(1000);
 
    set temp = '$';
    set temp_char = cast(root_id as char);
 
    while temp_char is not null do
        set temp = concat(temp,',',temp_char);
        select group_concat(cid) into temp_char from category where find_in_set(pid,temp_char) > 0;
    end while;
    
    return temp;
 
end
;;
delimiter ;

-- ----------------------------
-- Function structure for tree_parent_lists
-- ----------------------------
DROP FUNCTION IF EXISTS `tree_parent_lists`;
delimiter ;;
CREATE FUNCTION `tree_parent_lists`(cid int)
 RETURNS varchar(1000) CHARSET utf8mb4
begin
 
    declare parent_list varchar(1000);
    declare parent_temp varchar(1000);
 
    set parent_temp = cast(cid as char);
 
    while parent_temp is not null do
        if (parent_list is not null) then
            set parent_list = concat(parent_temp,',',parent_list);
        else
            set parent_list = concat(parent_temp);
        end if;
        select group_concat(pid) into parent_temp from category where find_in_set(cid,parent_temp) > 0;
    end while;
    
    return parent_list;
 
end
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
