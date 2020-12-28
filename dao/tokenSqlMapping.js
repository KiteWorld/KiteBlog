var sql = {
	login: "select * from k_user where u_name=? and u_password=?",
	adminLogin: "select * from k_admin where a_name=? and a_password=?"
}
module.exports = sql