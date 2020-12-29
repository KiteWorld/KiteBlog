let sql = {
	queryHotPoint: (filters) => `SELECT hp_id AS hotPointId, hp_content AS hotPointContent, hp_createdate AS createDate, hp_pictrue AS hotPointPictrue, hp_like AS likeCount, u.u_name AS userName, u.u_icon AS userIcon, cat.cat_name AS categoryName, cat.cat_id AS categoryId FROM k_hot_point hp LEFT JOIN k_user u ON hp.u_id = u.u_id LEFT JOIN k_category cat ON hp.cat_id = cat.cat_id  where ${filters} limit ?,?`,
	queryHotPointCount: (filters) => `SELECT COUNT(*) total FROM k_hot_point a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id  where ${filters}`,
	updateHotPoint: "update k_hot_point set cat_id =? where hp_id in (?)",
	updateAryicleCatRel: "update k_hp_category_relationship set cat_id = ? where hp_id in (?)",
	deleteHotPoint: "delete from k_hot_point where hp_id in (?)",
	insertHotPoint: "insert into k_hot_point ?"
}
module.exports = sql