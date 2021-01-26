let sql = {
	// getRouterIds: "select r_id as catorgreyId from k_router",
	// updateRouter: (updateContent) => `update k_router set ${updateContent} where r_id in ?`,
	// delRouters: (delRouterIds) => `delete from k_router where r_id in (${delRouterIds})`,
	queryRouterIsExist: "select * from k_router where r_path = ? or r_name = ?",
	queryRouter: "SELECT r_id AS routerId, r_path AS path, r_name AS name, r_component AS component, r_title AS title , r_affix AS isAffix, r_roles AS roles, r_icon AS icon, r_nocache AS noCache, r_redirect AS redirect , r_parentid AS routerParentId, r_order AS routerOrder, r_level AS routerLevel, r_is_external AS isExternal,r_target AS target FROM k_router WHERE FIND_IN_SET(?,r_roles) ORDER BY r_level, r_order",
	delRouterById: `delete from k_router where r_id = ?`,

	//支持单条、多条数据插入
	insertRouter: `insert into k_router (r_path,r_name,r_title,r_affix,r_roles,r_icon,r_nocache,r_redirect,r_component,r_parentid,r_order,r_level,r_is_external,r_target) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
	updateRouterById: `update k_router set r_path=?,r_name=?,r_title=?,r_affix=?,r_roles=?,r_icon=?,r_nocache=?,r_redirect=?,r_component=?,r_parentid=?,r_order=?,r_level=?,r_is_external=?,r_target=? where r_id = ?`,
	queryChildrenCount: `select count(*) as childrenCount from k_router where r_parentid = ?`,
}

module.exports = sql