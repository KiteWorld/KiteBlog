let express = require("express")
// let jwt = require('express-jwt');
let jwt = require("jsonwebtoken")
let router = express.Router();
let dashboardDao = require('../dao/dashboardDao')

//websocket链接 需要通过 app.ws/app.wss 调用
global.app.ws('/dashboard', function (ws, req) {
	let timer
	ws.on('message', function (msg) {
		if (!ws.protocol) {
			return ws.close()
		} else {
			jwt.verify(ws.protocol, global.servers.SECRET_KEY, {
				algorithms: ['HS256'],
			}, async (err, decoded) => {
				if (err) {
					const res = {
						code: 1,
						msg: "token已过期"
					}
					ws.send(JSON.stringify(res))
					ws.close()
					return
				}
				let recvData = JSON.parse(msg)
				let socketType = recvData.socketType
				if (!recvData.socketType) {
					const res = {
						code: 1,
						msg: "socketType不能为空"
					}
					ws.send(JSON.stringify(res))
					ws.close()
					return
				}
				let data = {
					socketType: socketType
				}
				switch (socketType) {
					case "total":
						if (global.servers.USER_TOTAL == -1 || global.servers.USER_TOTAL == -1 || global.servers.USER_TOTAL == -1) {
							await dashboardDao.queryTotal()
						}
						data.total = {
							user_total: global.servers.USER_TOTAL,
							article_total: global.servers.ARTICLE_TOTAL,
							hotpoint_total: global.servers.HOTPOINT_TOTAL,
						}
						console.log(data.total)
						break;
					case "articleHot10":
						data.articleHot10 = await dashboardDao.articleHot10(recvData.time === "today" ? recvData.time : null)
						break;
					case "trendChart":
						let dateRange = ""
						if ([7, 15, 30].includes(recvData.day)) {
							for (let i = 0; i < recvData.day; i++) {
								if (i === 0) {
									dateRange += `SELECT curdate() AS date UNION ALL `
								} else if (recvData.day - 1 > i > 0) {
									dateRange += `SELECT date_sub(curdate(), INTERVAL ${i} DAY) AS date UNION ALL `
								} else {
									dateRange += `SELECT date_sub(curdate(), INTERVAL ${i} DAY) AS date`
								}
							}
							data.dayTotal = await dashboardDao.queryDayTotal(dateRange, recvData.day)
						}
						break;
					case "articleCatTotal":
						data.articleCatTotal = await dashboardDao.articleCatTotal()
						break;
					default:
						break;
				}
				if (recvData.millisecond) {
					clearInterval(timer)
					ws.send(JSON.stringify(data))
					let millisecond = parseInt(recvData.millisecond)
					millisecond = millisecond < 2000 ? 2000 : millisecond
					timer = setInterval(() => {
						ws.send(JSON.stringify(data))
					}, millisecond)
				} else {
					ws.send(JSON.stringify(data))
				}
			});
		}
	})
	ws.on('close', function () {
		clearInterval(timer)
	})
})



module.exports = router;