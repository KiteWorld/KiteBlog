var sql = {
	insert: "insert into d_user(u_name,u_password,u_sex,u_icon,u_create_time) VALUES(?,?,?,?,?)",
	update: "update d_user set u_sex=?,u_icon=?,u_description=? where u_id=?",
	updateStatus: (userIds) => `update d_user set u_status=? where u_id in (${userIds})`,
	updateRole: "update d_user set u_role=? where u_id=?",
	updatePassword: "update d_user set u_password=? where u_id=? and u_password=? and u_name=?",
	delete: (userIds) => `delete from d_user where u_id in (${userIds})`,
	queryById: "select * from d_user where u_id=?",
	queryByName: "select * from d_user where u_name=?",
	queryAll: (filters) => `select u_id as userId, u_name as name,u_role as role,u_status as status,u_sex as sex ,u_icon as icon,u_create_time as createTime from d_user where ${filters} limit ?,?`,
	// queryAll: `select u_id as userId, u_name as name,u_role as role,u_status as status,u_sex as sex ,u_icon as icon,u_create_time as createTime from d_user limit ?,?`,
	queryAllCount: (filters) => `select COUNT(*) as total from d_user where ${filters} `
}

module.exports = sql