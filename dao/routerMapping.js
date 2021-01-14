let sql = {
	getRouterIds: "select cat_id as catorgreyId from k_router",
	updateRouter: (updateContent) => `update k_router set ${updateContent} where cat_id in ?`,
	delRouters: (delRouterIds) => `delete from k_router where cat_id in (${delRouterIds})`,
	queryRouter: "SELECT r_id AS routerId, r_path AS path, r_name AS name, r_component AS component, r_title AS title , r_affix AS isAffix, r_roles AS roles, r_icon AS icon, r_nocache AS noCache, r_redirect AS redirect , r_parentid AS routerParentId, r_order AS routerOrder, r_level AS routerLevel FROM k_router WHERE r_roles LIKE ? ORDER BY r_level, r_order",
	delRouterById: `delete from k_router where cat_id = ?`,
	//支持单条、多条数据插入
	insertRouter: `insert into k_router (cat_name,cat_parentid,cat_status,cat_order,cat_type,cat_level,cat_description) VALUES ?`,
	updateRouterById: `update k_router set cat_name=?,cat_status=?,cat_order=?,cat_description=? where cat_id = ?`,
	queryChildrenCount: `select count(*) as childrenCount from k_router where cat_parentid = ?`,
	updateRouterOrder: `update k_router set cat_order=? where cat_id = ?`,
}

module.exports = sql