# Changelog

## [0.5.9] - 2021-10-19
### Fix
* GetDraftsResponse接口错误
* 没传cookie
* add export to enum
* 大小写不对

## [0.5.8] - 2021-10-18
### Feat
* sessdata -> SESSDATA

## [0.5.7] - 2021-10-17
### Feat
* 上传直播封面失败

## [0.5.6] - 2021-10-16
### Feat
* 获取自己直播间的封面

## [0.5.5] - 2021-10-15
### Feat
* 增加一些说明

## [0.5.4] - 2021-10-14
### Feat
* 初始化credential时可以接受dev_id

## [0.5.3] - 2021-10-13
### Feat
* 使用callback检测是否完成登录

## [0.5.2] - 2021-10-12
### Feat
* 轮询扫码结果直到结束

### Chore
* 不再依赖 qrcode-terminal，转向 qrcode

## [0.5.1] - 2021-10-11
### Change
* 不再导出 Request

### Doc
* 给每个 class 加了doc
* 更新 readme

## [0.5.0] - 2021-10-10
### Feat
* 发布啦

## [0.4.9] - 2021-10-09
### Feat
* 扫码登录

## [0.4.8] - 2021-10-08
### Feat
* 获取直播分区列表

## [0.4.7] - 2021-10-07
### Feat
* 获取房间信息

## [0.4.6] - 2021-10-06
### Feat
* 修改直播间封面

## [0.4.5] - 2021-10-05
### Feat
* axios auto retry
* check&read path

### Change
* uploadBfs no longer support PathLike class

### Delete
* unused interface

## [0.4.4] - 2021-10-04
### Change
* 简化Request调用

### Style
* 优化代码风格

## [0.4.3] - 2021-10-03
### Feat
* 刷新推流地址
* 修改主播公告
* 修改直播间标题，简介，tag

## [0.4.2] - 2021-10-02
### Feat
* 直播间开播，下播
* 直播间签到
* 直播站个人信息
* BiliCredential会自动获取主站和直播站个人信息

## [0.4.0] - 2021-09-30
### Feat
* 私信图片
* 更方便的调用方法
* msg_type 检查

### Fix
* uploadBfs 中大小写检查错误

## [0.3.9] - 2021-09-29
### Feat
* 直接通过网址上传网络图片
* 上传前检查文件格式和大小

### Change
* uploadBfs 从 Dynamic 移动到 Common

## [0.3.8] - 2021-09-28
### Feat
* 发送私信
* BiliCredential中增加dev_id

## [0.3.7] - 2021-09-27
### Feat
* 发起投票

### Chore
* move from query-string to qs

## [0.3.6] - 2021-09-26
### Feat
* 读取私信
* 标记已读

### Fix
* MsgBoxResp.SessionList.LastMsg.at_uids type error

## [0.3.5] - 2021-09-25
### Feat
* 获取私信列表

## [0.3.4] - 2021-09-24
### Feat
* 批量获取用户信息

## [0.3.3] - 2021-09-23
### Feat
* 系统消息

### Fix
* 没加credential
* Total.items内容错误

## [0.3.2] - 2021-09-22
### Feat
* 回复消息
* 收到的赞

## [0.3.1] - 2021-09-21
### Feat
* 未读私信数量
* 未读消息数量

## [0.3.0] - 2021-09-20
### Feat
* 添加prejudge
### Change
* credential中可选的提供uid

## [0.2.9] - 2021-09-19
### Change
* 不再要求提供buvid3

## [0.2.7] - 2021-09-17
### Feat
* 操作和用户的关系

## [0.2.6] - 2021-09-16
### Fix
* 点赞视频时url和请求参数错误

## [0.2.5] - 2021-09-15
### Feat
* 实例化Video时可以传入bvid，快捷使用评论区功能

## [0.2.4] - 2021-09-14
### Change
* 点赞和踩的返回统一改为boolean形

## [0.2.3] - 2021-09-13
### Feat
* 获取未发布定时动态列表
* 删除未发布定时动态
* 立即发布定时动态

## [0.2.0] - 2021-09-11
### Feat
* 支持定时发布动态

## [0.1.9] - 2021-09-10
### Change
* Comment实例化时可以指定oid和type
* Comment内方法入参顺序调整

## [0.1.8] - 2021-09-08
### Feat
* av bv 号互转
* 收藏时可以传入av或bv号

## [0.1.6] - 2021-09-07
### Feat
* 视频信息，点赞，投币，收藏，三连
### Change
* 初始化Video时可以选择加入bvid

## [0.1.4] - 2021-09-06
### Change
* 简化部分return

## [0.1.3] - 2021-09-05
### Feat
* 新增Video类以及type

## [0.1.2] - 2021-09-03
### Chore
* change configuration files
* update dependency version

## [0.1.1] - 2021-09-02
### Fix
* type error

## [0.1.1] - 2021-09-02
### Fix
* type error

## [0.1.0] - 2021-09-01
### Feat
* 扩展短链接
* 检查链接内容的type

## [0.0.9] - 2021-08-31
### Feat
* 获取动态内容
### Style
* add semicolon

## [0.0.8] - 2021-08-25
### Feat
* 查看用户信息
* 检查用户id是否存在
### Change
* User -> UserInfo

### Fix
* 传入文件路径时没有正确创建readStream

## [0.0.7] - 2021-08-24
### Feat
* 分享内容到动态
* 置顶评论
### Change
* Ctype -> Btype

## [0.0.6] - 2021-08-23
### Feat
* 发布和删除回复
### Change
* oid类型变为string

## [0.0.5] - 2021-08-21
### Feat
* 添加HEAD方法 (36e06d0d246623a9504c2fcd5544fb2bc48c8e07)
* 评论区列表，点赞，踩 (af7d8f0fd8b3f46df76ec31880ee46a9e0abb7d8)
### Doc
* 添加doc (2fa1d1b023013ad7fe105098e834c8740a9c0a22)

### Change
* Throw when code != 0 (c2344e82748e893c4962916d25fa6a3b37f53acc)
### Fix
* filename typo (3533200c186af5977bc65cb721788241138b4276)

## [0.0.2] - 2021-08-20
### Feat
* 转发，点赞，取消点赞动态 (5a15e4c8e6a8b46aa94501289debee9e197fc82c)

## [0.0.1] - 2021-08-19
### Feat
first upload (7d3188ff81ebd361f8fbe081ba4a47fb6d48b763)