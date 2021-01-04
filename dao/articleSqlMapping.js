let sql = {
	saveLike: "update k_article set a_likecount = a_likecount+1  where a_id=?",
	cancelLike: "update k_article set a_likecount = a_likecount-1  where a_id=?",
	addViewCount: "update k_article set a_viewcount = a_viewcount+1 where a_id=?",
	queryArticleById: "SELECT a_id AS articleId, a_title AS title,a_content as content,a_markdown as markdown, a_status AS status, a_type AS articleType, a_createdate AS createDate , a_updatedate AS updateDate, a_banner AS banner, b.u_id AS userId, b.u_name AS userName, c.cat_name AS categoryName , c.cat_id AS categoryId FROM k_article a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id WHERE a_id = ?",
	queryArticleByCatId: (filters) => `select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner,a_viewcount as viewCount,a_likecount as likeCount from k_article where cat_id=? where ${filters} limit ?,?`,
	queryArticleListByUId: "select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner,a_viewcount as viewCount,a_likecount as likeCount from k_article where u_id=? limit ?,?",
	insertArticle: "insert into k_article (a_title,a_content,a_markdown,a_type,u_id,cat_id,a_updatedate,a_createdate) values(?,?,?,?,?,?,?,?)",
	updateArticle: "update k_article set a_title = ?,a_content = ?,a_markdown = ?,a_type = ?,u_id = ?,cat_id = ?,a_updatedate = ? where a_id=?",
	insertArticleCatRel: "insert into k_article_category_relationship (a_id,cat_id) values(?,?)",


	queryArticles: (filters) => `SELECT a_id AS articleId,a_title AS title,a_status AS status, a_type AS articleType, a_createdate AS createDate, a_updatedate AS updateDate, a_banner AS banner, a_viewcount AS viewCount, a_likecount AS likeCount,a_reject_remark AS rejectRemark, b.u_name AS userName, c.cat_name AS categoryName, c.cat_id AS categoryId FROM k_article a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id  where ${filters} limit ?,?`,
	// queryArticles: (filters) => `SELECT a_id AS articleId,a_title AS title,a_status AS status, a_createdate AS createDate, a_updatedate AS updateDate, a_banner AS banner, a_viewcount AS viewCount, a_likecount AS likeCount,a_reject_remark AS rejectRemark, b.u_name AS userName, c.cat_name AS categoryName, c.cat_id AS categoryId FROM k_article a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id  where ${filters} limit ?,?`,
	queryArticlesCount: (filters) => `SELECT COUNT(*) total FROM k_article a LEFT JOIN k_user b ON a.u_id = b.u_id LEFT JOIN k_category c ON a.cat_id = c.cat_id  where ${filters}`,
	// updateArticle: "update k_article set a_title=?,a_content=?,a_banner=?,a_status=?,a_updatedate=? where a_id=?",
	updateArticleCat: "update k_article set cat_id =? where a_id in (?)",
	updateArticleCatRel: "update k_article_category_relationship set cat_id = ? where a_id in (?)",
	updateArticleStatus: "update k_article set a_status=? where a_id in (?)",
	updateArticleType: "update k_article set a_type=? where a_id in (?)",
	rejectArticle: "update k_article set a_status=?,a_reject_remark = ? where a_id in (?)",
	deleteArticle: "delete from k_article where a_id in (?)",
	deleteAryicleCatRel: "delete from k_article_category_relationship where a_id in (?)",
}
module.exports = sql