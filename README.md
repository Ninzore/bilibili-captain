# bilibili-captain
一些B站API的调用

用来操作B站的一些功能。基本来自于web端接口。
提供接口的返回值类型（还是比较可靠的

### Usage
```typescript
import {BiliCapt} from "bilicaptain";  // 导入全部
BiliCapt.Live ...

or

// 按需导入
import {Live, User, Login, Video, 
Comment, Dynamic, Message, BiliCredential} from "bilicaptain";
```

### 目前支持
#### 登录 Login
目前可以扫码登录或手动输入cookie信息
```
Login.loginQR();  // 扫码登录
new BiliCredential("SESSDATA", "bili_jct");  //手动输入cookie
```

#### 动态 Dynamic
1. 发送，删除，定时动态（包含文字/图片/投票动态）
2. 获取未发布定时动态，提前发布，删除
3. 点赞，转发
4. 分享内容到动态

#### 用户 User
1. 检查用户是否存在
2. 单独/批量获取用户信息
3. 获取自己详细信息
4. 搜索用户
5. 操作关系

#### 消息 Message
1. 发送/撤回 文字/图片私信
2. 未读消息/私信数量
3. 私信
4. 系统通知
5. 收到的赞
6. 收到的回复
7. 标记已读
8. 获取来自一个人的私信详情

#### 评论区 Comment
1. 发送/删除 评论/回复
2. 置顶评论
3. 列出评论区
4. 点赞/踩


#### 视频 Video
1. 获取简介
2. 获取详情
3. 查看视频状态（观看、点赞、投币、弹幕等等的数量）
4. 获取分p列表
5. 点赞、投币、收藏、一键三连

#### 直播 Live
1. 签到
2. 获取个人信息
3. 开播，下播
4. 获取/刷新推流地址
5. 修改主播公告
6. 修改直播间标题，简介，tag
7. 修改直播封面
8. 查看分区列表