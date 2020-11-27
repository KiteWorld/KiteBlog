var sql = {
	insert: "insert into d_user(u_name,u_password,u_role,u_sex,u_create_time) VALUES(?,?,?,?,?)",
	update: "update d_user set u_name=?,u_sex=?,u_password=?,u_icon=? where u_id=?",
	updateStatus: "update d_user set u_status=? where u_id=?",
	updateRole: "update d_user set u_role=? where u_id=?",
	delete: "delete from d_user where u_id=?",
	queryById: "select * from d_user where u_id=?",
	queryByName: "select * from d_user where u_name=?",
	queryAll: "select * from d_user limit ?,?"
}

module.exports = sql