let sql = {
	queryHotPoint: (filters) => `SELECT hp_id AS hotPointId, hp_content AS hotPointContent, hp_createdate AS createDate, hp_pictrue AS hotPointPictrues,hp_status AS hotPointStatus,hp_type AS hotPointType,hp_like AS likeCount,hp_reject_remark AS rejectRemark, u.u_name AS userName,c.cat_name AS categoryName, c.cat_id AS categoryId FROM k_hot_point hp LEFT JOIN k_user u ON hp.u_id = u.u_id LEFT JOIN k_category c ON hp.cat_id = c.cat_id  where ${filters} limit ?,?`,
	queryHotPointCount: (filters) => `SELECT COUNT(*) total FROM k_hot_point a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id  where ${filters}`,
	updateHotPointCat: "update k_hot_point set cat_id =? where hp_id in (?)",
	updateHotPointCatRel: "update k_hp_category_relationship set cat_id = ? where hp_id in (?)",
	updateHotPointType: "update k_hot_point set hp_type=? where hp_id in (?)",
	updateHotPointStatus: "update k_hot_point set hp_status=? where hp_id in (?)",
	deleteHotPoint: "delete from k_hot_point where hp_id in (?)",
	insertHotPoint: "insert into k_hot_point ?",
	insertHotPointCatRel: "insert into k_article_category_relationship (u_id,cat_id) values(?,?)",

}
module.exports = sql