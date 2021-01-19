var sql = {
	login: "select * from k_user where u_name=? and u_password=?",
	adminLogin: "SELECT cms_u_id CMSUserId, cms_u_name name,cms_u_password password,cms_u_role role,cms_u_avatar avatar,a.u_id userId,cms_u_createdate createDate FROM k_cms_user a LEFT JOIN k_user b ON a.u_id = b.u_id WHERE cms_u_name = ? AND cms_u_password = ?"
}
module.exports = sql