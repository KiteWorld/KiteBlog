const {
	update
} = require("./userSqlMapping")

let sql = {

	getCatIds: "select cat_id as catorgreyId from k_category",
	// insertCats: (insertContent) => `insert into k_category (cat_name,cat_parentid,cat_status,cat_order,cat_description) VALUES ${insertContent}`,
	updateCats: (updateContent) => `update k_category set ${updateContent} where cat_id in ?`,
	delCats: (delCatIds) => `delete from k_category where cat_id in (${delCatIds})`,

	queryCats: "SELECT cat.cat_status as categoryStatus,cat.cat_name as categoryName,cat.cat_parentid as categoryParentId,cat.cat_level as categoryLevel,cat.cat_type as categoryType,cat.cat_description as description,cat.cat_id as categoryId,cat.cat_order as categoryOrder,IFNULL(catecount.articleCount,0) articleCount FROM(SELECT COUNT(rel.cat_id) as articleCount,cat_id FROM k_article_category_relationship as rel GROUP BY(rel.cat_id)) catecount RIGHT JOIN k_category as cat ON cat.cat_id = catecount.cat_id WHERE cat.cat_type = ? ORDER BY cat_level,categoryOrder",
	queryHotPointCats: (filterContent) => `SELECT cat.cat_status as categoryStatus,cat.cat_name as categoryName,cat.cat_parentid as categoryParentId,cat.cat_level as categoryLevel,cat.cat_type as categoryType,cat.cat_description as description,cat.cat_id as categoryId,cat.cat_order as categoryOrder,IFNULL(catecount.hotPointCount,0) hotPointCount FROM(SELECT COUNT(rel.cat_id) as hotPointCount,cat_id FROM k_hp_category_relationship as rel GROUP BY(rel.cat_id)) catecount RIGHT JOIN k_category as cat ON cat.cat_id = catecount.cat_id WHERE cat.cat_type = ? and ${filterContent} ORDER BY cat_level,categoryOrder`,
	queryCatsList: "SELECT cat_name as categoryName,cat_id as categoryId,cat_level as categoryLevel FROM k_category WHERE cat_type = ? ORDER BY cat_level",
	queryCatsCount: "select count(*) as total from k_category where cat_type = ?",
	queryCatArticleCount: "select count(*) as articleCount from k_article_category_relationship where cat_id = ?",
	queryCatHotPointCount: "select count(*) as hotPointCount from k_hp_category_relationship where cat_id = ?",
	delCatById: `delete from k_category where cat_id = ?`,
	//支持单条、多条数据插入
	insertCats: `insert into k_category (cat_name,cat_parentid,cat_status,cat_order,cat_type,cat_level,cat_description) VALUES ?`,
	updateCatById: `update k_category set cat_name=?,cat_status=?,cat_order=?,cat_description=? where cat_id = ?`,
	queryChildrenCount: `select count(*) as childrenCount from k_category where cat_parentid = ?`,
	updateCategoryOrder: `update k_category set cat_order=? where cat_id = ?`,

	//分类数据迁移
	updateHotPointCateRelId: `update k_hp_category_relationship set cat_id=? where cat_id = ?`,
	updateArticleCateRelId: `update k_article_category_relationship set cat_id=? where cat_id = ?`,
	updateHotPointCateId: `update k_hot_point set cat_id=? where cat_id = ?`,
	updateArticleCateId: `update k_article set cat_id=? where cat_id = ?`
}

module.exports = sql