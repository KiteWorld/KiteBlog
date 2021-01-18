const USER_STATUS = {

}

const ROLE_TYPE = {

}

const ARTICLE_HOTPOINT_TYEP = {
	"normal": "普通",
	"recommend": "推荐",
	"hot": "热门",
	"top": "置顶"
}
const HOTPOINT_STATUS = {
	"normal": "普通",
	"remove": "移除",
}
module.exports = {
	SECRET_KEY: "Kite1874", //尽量来些奇奇怪怪的,用于生成验证和解析Token
	ROOT_URL: "http://localhost:1874/", //暂时写死，后面根据环境使用不同 URL
	USER_STATUS,
	ROLE_TYPE,
	ARTICLE_HOTPOINT_TYEP,
	HOTPOINT_STATUS
}