CREATE TABLE `category` (
`cid` int(11) NOT NULL AUTO_INCREMENT COMMENT '类目ID',
`name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类目名',
`pid` int(11) NOT NULL DEFAULT 0 COMMENT '父ID',
PRIMARY KEY (`cid`) 
)
ENGINE = MyISAM
AUTO_INCREMENT = 11
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci
COMMENT = '分类表'
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_admin` (
`a_id` int(11) NOT NULL AUTO_INCREMENT,
`a_name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`a_password` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`a_role` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'superadmin',
`a_create_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`a_id`) 
)
ENGINE = InnoDB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_article` (
`a_id` int(11) NOT NULL AUTO_INCREMENT,
`a_title` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`a_content` varchar(20000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`a_createdate` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
`a_updatedate` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
`a_viewcount` int(11) NOT NULL,
`a_likecount` int(11) NOT NULL,
`a_banner` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
`a_status` smallint(1) NOT NULL DEFAULT 0,
`u_id` int(11) NOT NULL,
PRIMARY KEY (`a_id`) ,
INDEX `fk_article_article_1` (`u_id` ASC) USING BTREE
)
ENGINE = InnoDB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_article_category_relationship` (
`acr_id` int(11) NOT NULL AUTO_INCREMENT,
`cat_id` int(11) NOT NULL,
`a_id` int(11) NOT NULL,
PRIMARY KEY (`acr_id`) ,
INDEX `fk_d_article_catorgery_relationship_d_article_catorgery_relatio1` (`a_id` ASC) USING BTREE,
INDEX `fk_d_article_catorgery_relationship_d_article_catorgery_relatio2` (`cat_id` ASC) USING BTREE
)
ENGINE = InnoDB
AUTO_INCREMENT = 5
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_category` (
`cat_id` int(11) NOT NULL AUTO_INCREMENT,
`cat_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`cat_parentid` int(11) NULL DEFAULT 0,
`cat_type` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'category',
`cat_order` int(11) NOT NULL DEFAULT 1,
`cat_description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
`cat_level` smallint(1) NOT NULL DEFAULT 1,
`cat_status` smallint(1) NOT NULL DEFAULT 0,
PRIMARY KEY (`cat_id`) 
)
ENGINE = InnoDB
AUTO_INCREMENT = 117
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_comment` (
`c_id` int(11) NOT NULL AUTO_INCREMENT,
`c_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`c_date` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
`c_like` int(11) NULL DEFAULT NULL,
`c_parent_id` int(11) NULL DEFAULT NULL,
`u_id` int(11) NOT NULL,
PRIMARY KEY (`c_id`) ,
INDEX `fk_d_comment_d_comment_1` (`u_id` ASC) USING BTREE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_favorites` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`u_id` int(11) NOT NULL,
`a_id` int(11) NOT NULL,
PRIMARY KEY (`id`) ,
INDEX `fk_d_favorites_d_favorites_2` (`a_id` ASC) USING BTREE,
INDEX `fk_d_favorites_d_favorites_1` (`u_id` ASC) USING BTREE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_follow` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`u_id` int(11) NOT NULL,
`f_id` int(11) NOT NULL,
`status` int(11) NOT NULL,
PRIMARY KEY (`id`) ,
INDEX `fk_d_follow_d_follow_1` (`u_id` ASC) USING BTREE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_like` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`type_id` int(11) NOT NULL,
`type` smallint(6) NOT NULL,
`u_id` int(11) NOT NULL,
`status` smallint(1) NOT NULL,
PRIMARY KEY (`id`) 
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;
CREATE TABLE `d_user` (
`u_id` int(11) NOT NULL AUTO_INCREMENT,
`u_name` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`u_password` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
`u_role` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'normal',
`u_sex` smallint(1) NOT NULL DEFAULT 0,
`u_icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
`u_status` smallint(1) NOT NULL DEFAULT 0,
`u_create_time` datetime NOT NULL,
PRIMARY KEY (`u_id`) 
)
ENGINE = InnoDB
AUTO_INCREMENT = 41
AVG_ROW_LENGTH = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic;

ALTER TABLE `d_article` ADD CONSTRAINT `fk_article_article_1` FOREIGN KEY (`u_id`) REFERENCES `d_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_article_category_relationship` ADD CONSTRAINT `fk_d_article_catorgery_relationship_d_article_catorgery_relatio1` FOREIGN KEY (`a_id`) REFERENCES `d_article` (`a_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_article_category_relationship` ADD CONSTRAINT `fk_d_article_catorgery_relationship_d_article_catorgery_relatio2` FOREIGN KEY (`cat_id`) REFERENCES `d_category` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_comment` ADD CONSTRAINT `fk_d_comment_d_comment_1` FOREIGN KEY (`u_id`) REFERENCES `d_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_favorites` ADD CONSTRAINT `fk_d_favorites_d_favorites_1` FOREIGN KEY (`u_id`) REFERENCES `d_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_favorites` ADD CONSTRAINT `fk_d_favorites_d_favorites_2` FOREIGN KEY (`a_id`) REFERENCES `d_article` (`a_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `d_follow` ADD CONSTRAINT `fk_d_follow_d_follow_1` FOREIGN KEY (`u_id`) REFERENCES `d_user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;

