var sql = {
	login: "select * from d_user where u_name=? and u_password=?",
	adminLogin: "select * from d_admin where a_name=? and a_password=?"
}
module.exports = sql