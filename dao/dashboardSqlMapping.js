let sql = {

	queryArticlesCount: `SELECT COUNT(*) total FROM k_article WHERE cat_id != 1935`,
	queryHotPointsCount: `SELECT COUNT(*) total FROM k_hot_point`,
	queryUsersCount: `SELECT COUNT(*) total FROM k_user`,

	queryTodayArticleHot10: `SELECT a_title as articleTitle,ROUND((a_likecount/a_viewcount),4) AS hotRang FROM  k_article WHERE a_createdate>=date(now()) and a_createdate<DATE_ADD(date(now()),INTERVAL 1 DAY) ORDER BY hotRang DESC limit 0,10`,
	queryArticleHot10: `SELECT a_title as articleTitle,ROUND((a_likecount/a_viewcount),4) AS hotRang FROM  k_article  ORDER BY hotRang DESC limit 0,10`,

	queryArticleDayTotal: (dateRange, day) => `SELECT DATE_FORMAT( date, '%Y-%m-%d') AS date, IFNULL(totalcount, 0) AS totalcount FROM (${dateRange}) datetable LEFT JOIN ( SELECT count(*) AS totalcount, a_createdate FROM k_article WHERE DATE_SUB(CURDATE(), INTERVAL ${day} DAY) <= date(a_createdate) GROUP BY date(a_createdate) ) datecount ON datetable.date = DATE(datecount.a_createdate)`,
	queryHotPointDayTotal: (dateRange, day) => `SELECT DATE_FORMAT( date, '%Y-%m-%d') AS date, IFNULL(totalcount, 0) AS totalcount FROM (${dateRange}) datetable LEFT JOIN ( SELECT count(*) AS totalcount, hp_createdate FROM k_hot_point WHERE DATE_SUB(CURDATE(), INTERVAL ${day} DAY) <= date(hp_createdate) GROUP BY date(hp_createdate) ) datecount ON datetable.date = DATE(datecount.hp_createdate)`,
	queryUserDayTotal: (dateRange, day) => `SELECT DATE_FORMAT( date, '%Y-%m-%d') AS date,IFNULL(totalcount, 0) AS totalcount FROM (${dateRange}) datetable LEFT JOIN ( SELECT count(*) AS totalcount, u_createdate FROM k_user WHERE DATE_SUB(CURDATE(), INTERVAL ${day} DAY) <= date(u_createdate) GROUP BY date(u_createdate) ) datecount ON datetable.date = DATE(datecount.u_createdate)`,

	//查询一级分类
	queryLevelCat: "SELECT cat_id categoryId FROM k_category WHERE cat_type = ? AND cat_level = 1",
	//查询该分类之下的所有子分类的内容总数（包括当前分类的数量）
	queryCatTotal: `SELECT SUM(total) AS total FROM ( SELECT cat1.cat_name AS categoryName, count(acr_id) AS total FROM ( SELECT cat_id, cat_name FROM ( SELECT t1.cat_id, t1.cat_name , IF(FIND_IN_SET(cat_parentid, @pids) OR FIND_IN_SET(cat_id, @pids) > 0, @pids := CONCAT(@pids, ',', cat_id), 0) AS ischild FROM ( SELECT cat_id, cat_parentid, cat_name FROM k_category ORDER BY cat_parentid, cat_id ) t1, ( SELECT @pids := ? ) t2 ) t3 WHERE ischild != 0 ) cat1 LEFT JOIN k_article_category_relationship ON cat1.cat_id = k_article_category_relationship.cat_id GROUP BY cat1.cat_id ) totaltable`,
	//查询该分类之下的所有子分类的内容总数(包括当前分类的数量)
	queryChildCatTotal: `SELECT cat1.cat_name AS categoryName, count(acr_id) AS total FROM ( SELECT cat_id, cat_name FROM ( SELECT t1.cat_id, t1.cat_name , IF(FIND_IN_SET(cat_parentid, @pids) OR FIND_IN_SET(cat_id, @pids) > 0, @pids := CONCAT(@pids, ',', cat_id), 0) AS ischild FROM ( SELECT cat_id, cat_parentid, cat_name FROM k_category ORDER BY cat_parentid, cat_id ) t1, ( SELECT @pids := 275 ) t2 ) t3 WHERE ischild != 0 ) cat1 LEFT JOIN k_article_category_relationship ON cat1.cat_id = k_article_category_relationship.cat_id GROUP BY cat1.cat_id`,
	//查询该分类之下的所有规定等级、内容类型的子分类的内容总数（不包括当前分类的数量）
	queryChildLevelCatTotal: `SELECT cat1.cat_name AS categoryName, count(acr_id) AS total FROM ( SELECT cat_id, cat_name FROM ( SELECT t1.cat_id, t1.cat_name , IF(FIND_IN_SET(cat_parentid, @pids), @pids := CONCAT(@pids, ',', cat_id), 0) AS ischild FROM ( SELECT cat_id, cat_parentid, cat_name FROM k_category WHERE cat_level = ? AND cat_type = ? ORDER BY cat_parentid, cat_id ) t1, ( SELECT @pids := ? ) t2 ) t3 WHERE ischild != 0 ) cat1 LEFT JOIN k_article_category_relationship ON cat1.cat_id = k_article_category_relationship.cat_id GROUP BY cat1.cat_id`,
}
module.exports = sql