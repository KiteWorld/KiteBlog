let sql = {

	getCatIds: "select cat_id as catorgreyId from d_category",
	// insertCats: (insertContent) => `insert into d_category (cat_name,cat_parentid,cat_status,cat_order,cat_description) VALUES ${insertContent}`,
	updateCats: (updateContent) => `update d_category set ${updateContent} where cat_id in ?`,
	delCats: (delCatIds) => `delete from d_category where cat_id in (${delCatIds})`,
	
	queryAllCats: "SELECT cat.cat_status as categoryStatus,cat.cat_name as categoryName,cat.cat_parentid as categoryParentId,cat.cat_level as categoryLevel,cat.cat_type as categoryType,cat.cat_description as description,cat.cat_id as categoryId,cat.cat_order as categoryOrder,IFNULL(catecount.articleCount,0) articleCount FROM(SELECT COUNT(rel.cat_id) as articleCount,cat_id FROM d_article_category_relationship as rel GROUP BY(rel.cat_id)) catecount RIGHT JOIN d_category as cat ON cat.cat_id = catecount.cat_id ORDER BY cat_level,categoryOrder",
	queryAllCatsList: "SELECT cat_name as categoryName,cat_id as categoryId,cat_level as categoryLevel FROM d_category ORDER BY cat_level",
	queryCatArticleCount: "select count(*) as articleCount from d_article_category_relationship where cat_id = ?",
	delCatById: `delete from d_category where cat_id = ?`,
	//支持单条、多条数据插入
	insertCats: `insert into d_category (cat_name,cat_parentid,cat_status,cat_order,cat_level,cat_description) VALUES ?`,
	updateCatById: `update d_category set cat_name=?,cat_parentid=?,cat_status=?,cat_order=?,cat_description=? where cat_id = ?`,
	queryChildrenCount: `select count(*) as childrenCount from d_category where cat_parentid = ?`,
	updateCategoryOrder: `update d_category set cat_order=? where cat_id = ?`
}

module.exports = sql