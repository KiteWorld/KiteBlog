//设计数据库字段时，建议和给前端的一致，或者约定规则处理起来比较方便，下面的做法为反面教材（太TM累了）。
const USER_TO_FRONT = {
	u_id: "userId",
	u_name: "userName",
	u_password: "password",
	u_role: "role",
	u_sex: "sex",
	u_icon: "icon",
	u_status: "status",
	u_create_time: "createTime"
}

const USER_TO_DB = {
	"userId": "u_id",
	"userName": "u_name",
	"password": "u_password",
	"role": "u_role",
	"sex": "u_sex",
	"icon": "u_icon",
	"status": "u_status",
	"createTime": "u_create_time",
}

const ARTICLE_TO_FRONT = {
	"a_id": "articleId",
	"a_title": "title",
	"a_content": "content",
	"a_createdate": "createDate",
	"a_updatedate": "updateDate",
	"a_viewcount": "viewCount",
	"a_likecount": "likeCount",
	"a_banner": "banner",
	"a_status": "status",
	"u_id": "userId",
}
const ARTICLE_TO_DB = {
	"a_id": "articleId",
	"a_title": "title",
	"a_content": "content",
	"a_createdate": "createDate",
	"a_updatedate": "updateDate",
	"a_viewcount": "viewCount",
	"a_likecount": "likeCount",
	"a_banner": "banner",
	"a_status": "status",
	"u_id": "userId",
}
const CATEGORY_TO_FRONT = {
	"cat_id": "categoryId",
	"cat_name": "categoryName",
	"cat_parentid": "categoryParentId",
	"cat_type": "categoryType",
	"cat_order": "categoryOrder",
	"cat_status": "categoryStatus",
	"cat_level": "categoryLevel",
	"cat_description": "description",
}

const CATEGORY_TO_DB = {
	"categoryId": "cat_id",
	"categoryName": "cat_name",
	"categoryParentId": "cat_parentid",
	"categoryType": "cat_type",
	"categoryOrder": "cat_order",
	"categoryStatus": "cat_status",
	"categoryLevel": "cat_level",
	"description": "cat_description",
}

module.exports = {
	USER_TO_FRONT,
	USER_TO_DB,
	ARTICLE_TO_FRONT,
	ARTICLE_TO_DB,
	CATEGORY_TO_FRONT,
	CATEGORY_TO_DB
}