## 胡说八道

半年前端抠图仔，不知天高地厚，尝试用 node 做一个类似于「掘金」的社区项目，主要是一个边学边写的过程，我也只是初学者，写的不好的地方请多多包涵指教。整个项目主要有三部分： Node 服务端 、管理后台和前台界面。预计完成时间3个月 (也只是预计，看看就好）。这个仓库是后端部分，前端部分文章下面有介绍和链接。



### Node 服务端 
- express-generator 「通过 express-generator 搭建，包含 cookie-parser（解析 cookie）、morgan（ 记录日志 ）、http-errors ( http错误响应  )、ejs（模板引擎）、debug 」
- node.js （JavaScript）
- mysql 
- jsonwebtoken
- express-jwt
- ......（持续更新）

#### 项目启动

先安装好 mysql 和 navcat（其他的类似的也可以）。然后导入 mysql_model.sql 生成对应的数据库，然后往数据库里面添加一个 账号密码。







### 管理后台
项目链接：[KiteBlog_Front_Admin](https://github.com/KiteWorld/KiteBlog_Front_Admin)
- 控制台 （监控日活量、停留时间等，这方面的经验空白，还要学一下“埋点”的艺术）
- 用户管理（分配权限、黑名单、删除用户）
- 内容管理  (文章的审核、驳回、分类等等)
- 课程管理 
- 沸点管理 
- ..... (.持续更新）

#### 技术栈
- vue-cli4.x
- vue-2.x
- webpack
- elementUI
- axios
- moment
- ..... (.持续更新）

### 前台界面
项目链接：[KiteBlog_Front_ToC](https://github.com/KiteWorld/KiteBlog_Front_ToC)
- 文章列表
- 文章编辑 
- 关注、搜索、上传、收藏、点赞等常规功能
- 沸点 （看情况）
- 课程 （主要为了学习支付方面的知识)
- ..... (.持续更新）

#### 技术栈
- vue-cli4.x
- vue2.x
- webpack4.x
- axios
- 组件库（观望中）
- ..... (.持续更新）



