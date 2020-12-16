let sql = {
	addArticle: "insert into a_article (a_title,a_content,a_createdate,a_updatedate,a_banner,a_status,u_id) values(?,?,?,?,?,?,?,?,?)",
	queryArticle: (filters) => `select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner ,a_viewcount as viewCount,a_likecount as likeCount from d_article where ${filters} limit ?,?`,
	queryArticleById: "select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner,a_viewcount as viewCount,a_likecount as likeCount from d_article where a_id=?",
	queryArticleByCatId: (filters) => `select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner,a_viewcount as viewCount,a_likecount as likeCount from d_article where cat_id=? where ${filters} limit ?,?`,
	queryArticleListByUId: "select a_title as title, a_content as content,a_createdate as createDate,a_updatedate as a_updateDate,a_banner as banner,a_viewcount as viewCount,a_likecount as likeCount from d_article where u_id=? limit ?,?",
	saveLike: "update a_article set a_likecount = a_likecount+1  where a_id=?",
	cancelLike: "update a_article set a_likecount = a_likecount-1  where a_id=?",
	addViewCount: "update a_article set a_viewcount = a_viewcount+1 where a_id=?",
	updateArticle: "update a_article set a_title=?,a_content=?,a_banner=?,a_status=?,a_updatedate=? where a_id=?",
	updateArticleStatus: "update a_article set a_status=? where a_id=?",
	deleteArticle: "delete * from a_article where a_id=?",

}