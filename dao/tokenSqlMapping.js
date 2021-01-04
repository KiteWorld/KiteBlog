var sql = {
	login: "select * from k_user where u_name=? and u_password=?",
	adminLogin: "SELECT * FROM k_admin a LEFT JOIN k_user b ON a.u_id = b.u_id WHERE a_name = ? AND a_password = ?"
}
module.exports = sql