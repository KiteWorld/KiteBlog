var path = require('path')
var fs = require('fs');
//https 需要申请 SSL证书，填写服务器上存放证书的路径即可，目前根目录上没有证书文件（运行生产环境命令会报错），请更具自己的情况添加。
var options = {
	key: fs.readFileSync(path.join(__dirname, '../privkey.pem')),
	cert: fs.readFileSync(path.join(__dirname, '../fullchain.pem'))
}
module.exports = options