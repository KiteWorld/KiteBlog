var sql = {
	//ToC用户
	insert: "insert into k_user(u_name,u_password,u_role,u_status,u_avatar,u_sex,u_email,u_phone,u_createdate) VALUES(?,?,?,?,?,?,?,?,?)",
	update: "update k_user set u_name=?,u_password=?,u_role=? ,u_status=? ,u_avatar=? ,u_sex=? ,u_email=? ,u_phone=? ,u_createdate=? where u_id=?",
	updateStatus: (userIds) => `update k_user set u_status=? where u_id in (${userIds})`,
	updateRole: "update k_user set u_role=? where u_id=?",
	updatePassword: "update k_user set u_password=? where u_id=? and u_password=? and u_name=?",
	delete: (userIds) => `delete from k_user where u_id in (${userIds})`,
	queryUserById: "select u_id userId,u_name userName,u_password password,u_role userRole,u_sex userSex,u_avatar avatar,u_status userStatus,u_email as email,u_phone as phone from k_user where u_id=?",
	queryIsExist: "select * from k_user where u_name= ? or u_email = ? or u_phone = ?",
	queryUser: (filters) => `select u_id as userId, u_name as userName,u_role as userRole,u_status as userStatus,u_sex as userSex ,u_avatar as avatar ,u_email as email,u_phone as phone,u_createdate as createDate from k_user where ${filters} limit ?,?`,
	queryUserTotal: (filters) => `select COUNT(*) as total from k_user where ${filters} `,
	queryAllUsersList: `select u_id as userId, u_name as userName,u_role as userRole,u_status as userStatus,u_sex as userSex ,u_avatar as avatar ,u_createdate as createDate from k_user where u_role = ? and u_name like ?`,

	//CMS用户
	queryCMSUserById: "select cms_u_id as CMSUserId, cms_u_name as userName,cms_u_job_no as jobNo,cms_u_password as password,cms_u_role as userRole,cms_u_avatar as avatar,a.u_id ToCUserId,cms_u_createdate as createDate ,b.u_name ToCUserName from k_cms_user a left join k_user b on a.u_id = b.u_id where cms_u_id=?",
	queryCMSUserByName: "select * from k_cms_user where cms_u_name=?",
	queryCMSUser: (filters) => `select cms_u_id as CMSUserId, cms_u_name as userName,cms_u_job_no as jobNo,cms_u_role as userRole,cms_u_avatar as avatar,a.u_id ToCUserId,cms_u_createdate as createDate,b.u_name ToCUserName from k_cms_user a left join k_user b on a.u_id = b.u_id  where ${filters} limit ?,?`,
	queryCMSUserTotal: (filters) => `select COUNT(*) as total from k_cms_user where ${filters} `,
	deleteCMSUser: (CMSUserIds) => `delete from k_cms_user where cms_u_id in (${CMSUserIds})`,
	updateCMSUser: "update k_cms_user set cms_u_name=?, cms_u_password=?, cms_u_role=?,cms_u_avatar=?,u_id=?,cms_u_createdate=? where cms_u_id=?",
	insertCMSUser: "insert into k_cms_user(cms_u_name,cms_u_password,cms_u_role,cms_u_avatar,u_id,cms_u_createdate,cms_u_job_no) VALUES(?,?,?,?,?,?,?)",
	queryJobNoMax: "SELECT max(cms_u_job_no) as jobNo FROM k_cms_user WHERE "
}

module.exports = sql