let SECRET_KEY = "";
let BASE_URL = "";
//记录 用户、文章、沸点总数，减少访问数据库的次数
let USER_TOTAL = -1;
let ARTICLE_TOTAL = -1;
let HOTPOINT_TOTAL = -1;



if (process.env.NODE_ENV === "development") {
	SECRET_KEY = 'Kite1874'
	BASE_URL = "http://localhost:1874.com/"
} else if (process.env.NODE_ENV === "production") {
	SECRET_KEY = "Kite18749999" // 生产环境，SECRET_KEY 用于 Token 的生成和验证，属于敏感信息，应在服务器中单独配置(不应该让所有的开发人员都只知道)
	BASE_URL = "https://kiteblog.api.kite1874.com/"
}
//配置全局对象，方便调用
global.servers = {
	SECRET_KEY,
	BASE_URL,
	USER_TOTAL,
	ARTICLE_TOTAL,
	HOTPOINT_TOTAL
}

// //连接数据库信息
// module.exports = {
// 	SECRET_KEY,
// 	BASE_URL
// }