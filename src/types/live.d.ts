export interface SignResp {
    text:        string;
    specialText: string;
    allDays:     number;
    hadSignDays: number;
    isBonusDay:  number;
}

export interface LiveUserInfoResp {
    uid:                number;
    uname:              string;
    face:               string;
    billCoin:           number;
    silver:             number;
    gold:               number;
    achieve:            number;
    vip:                number;
    svip:               number;
    user_level:         number;
    user_next_level:    number;
    user_intimacy:      number;
    user_next_intimacy: number;
    is_level_top:       number;
    user_level_rank:    string;
    user_charged:       number;
    identification:     number;
}

export interface StartLiveResp {
    change:          number;
    status:          string;
    room_type:       number;
    rtmp:            Rtmp;
    protocols:       any[];
    try_time:        string;
    live_key:        string;
    sub_session_key: string;
    notice:          Notice;
}

export interface StopLiveResp {
    change: number;  // 1为成功
    status: string;  // 成功后这地方是 "PREPARING"
}


interface Notice {
    type:        number;
    status:      number;
    title:       string;
    msg:         string;
    button_text: string;
    button_url:  string;
}

interface Rtmp {
    addr:     string;
    code:     string;
    new_link: string;
    provider: string;
}

export interface StreamAddrResp {
    addr:     Addr;
    line:     Line[];
    srt_addr: SrtAddr;
}

interface Addr {
    addr: string;  // rtmp链接
    code: string;
}

interface Line {
    cdn_name:  string;
    line_name: string;
    src:       number;
    checked:   number;
}

interface SrtAddr {
    addr: string;  // str链接
    code: string;
}

export interface UploadCoverResp {
    etag:     string;
    location: string;
}

export interface RoomInfoResp {
    uid:                     number;
    room_id:                 number;
    short_id:                number;
    attention:               number;
    online:                  number;
    is_portrait:             boolean;
    description:             string;
    live_status:             number;
    area_id:                 number;
    parent_area_id:          number;
    parent_area_name:        string;
    old_area_id:             number;
    background:              string;
    title:                   string;
    user_cover:              string;
    keyframe:                string;
    is_strict_room:          boolean;
    live_time:               string;
    tags:                    string;
    is_anchor:               number;
    room_silent_type:        string;
    room_silent_level:       number;
    room_silent_second:      number;
    area_name:               string;
    pendants:                string;
    area_pendants:           string;
    hot_words:               string[];
    hot_words_status:        number;
    verify:                  string;
    new_pendants:            NewPendants;
    up_session:              string;
    pk_status:               number;
    pk_id:                   number;
    battle_id:               number;
    allow_change_area_time:  number;
    allow_upload_cover_time: number;
    studio_info:             StudioInfo;
}

interface NewPendants {
    frame:        Frame;
    badge:        null;
    mobile_frame: Frame;
    mobile_badge: null;
}

interface Frame {
    name:         string;
    value:        string;
    position:     number;
    desc:         string;
    area:         number;
    area_old:     number;
    bg_color:     string;
    bg_pic:       string;
    use_old_area: boolean;
}

interface StudioInfo {
    status:      number;
    master_list: any[];
}

export interface BaseInfoResp {
    room_id:          number;
    uid:              number;
    area_id:          number;
    live_status:      number;
    live_url:         string;
    parent_area_id:   number;
    title:            string;
    parent_area_name: string;
    area_name:        string;
    live_time:        string;
    description:      string;
    tags:             string;
    attention:        number;
    online:           number;
    short_id:         number;
    uname:            string;
    cover:            string;
    background:       string;
    join_slide:       number;
    live_id:          number;
}

export interface LiveAreaListResp {
    id:   number;
    name: AreaName;
    list: SubArea[];
}

interface SubArea {
    id:                string;
    parent_id:         string;
    old_area_id:       string;
    name:              string;
    act_id:            string;
    pk_status:         string;
    hot_status:        number;
    lock_status:       string;
    pic:               string;
    complex_area_name: ComplexAreaName;
    parent_name:       AreaName;
    area_type:         number;
    cate_id?:          string;
}

export enum ComplexAreaName {
    Empty = "",
    影音館 = "影音館",
    視頻唱見 = "視頻唱見",
}

export enum AreaName {
    网游 = "网游",
    手游 = "手游",
    单机游戏 = "单机游戏",
    娱乐 = "娱乐",
    电台 = "电台",
    虚拟主播 = "虚拟主播",
    生活 = "生活",
    学习 = "学习",
    赛事 = "赛事",
    大事件 = "大事件"
}

export interface GetCoverListResp {
    id:            number;
    audit_status:  number;
    audit_reason:  string;
    url:           string;
    select_status: number;
    type:          string;
}

export enum AreaIds {
    "英雄联盟"= 86,
    "穿越火线"= 88,
    "CS=GO"= 89,
    "APEX英雄"= 240,
    "DOTA2"= 92,
    "守望先锋"= 87,
    "吃鸡行动"= 80,
    "逃离塔科夫"= 252,
    "最终幻想14"= 102,
    "VALORANT"= 329,
    "CFHD "= 472,
    "300英雄"= 84,
    "炉石传说"= 91,
    "剑网3怀旧服"= 499,
    "剑灵"= 505,
    "超激斗梦境"= 519,
    "神佑释放"= 498,
    "逆战"= 487,
    "魔兽争霸3"= 181,
    "DNF"= 78,
    "剑网3"= 82,
    "魔兽世界"= 83,
    "FIFA ONLINE 4"= 388,
    "使命召唤=战区"= 318,
    "星际战甲"= 249,
    "坦克世界"= 115,
    "战舰世界"= 248,
    "战争雷霆"= 316,
    "战意"= 383,
    "无限法则"= 196,
    "风暴英雄"= 114,
    "星际争霸2"= 93,
    "刀塔自走棋"= 239,
    "堡垒之夜"= 164,
    "枪神纪"= 251,
    "三国杀"= 81,
    "龙之谷"= 112,
    "古剑奇谭OL"= 173,
    "幻想全明星"= 176,
    "封印者"= 300,
    "怀旧网游"= 288,
    "新游前瞻"= 298,
    "星战前夜=晨曦"= 331,
    "梦幻西游端游"= 350,
    "流放之路"= 551,
    "永恒轮回=黑色幸存者"= 459,
    "泰亚史诗"= 558,
    "其他游戏"= 107,
    "王者荣耀"= 35,
    "和平精英"= 256,
    "LOL手游"= 395,
    "原神"= 321,
    "幻塔"= 550,
    "哈利波特=魔法觉醒 "= 474,
    "金铲铲之战"= 514,
    "第五人格"= 163,
    "明日方舟"= 255,
    "使命召唤手游"= 386,
    "Fate/GO"= 37,
    "少女前线=云图计划"= 525,
    " 东方归言录"= 538,
    "关于我转生变成史莱姆这档事"= 568,
    "爆裂魔女"= 542,
    "阴阳师"= 36,
    "崩坏=星穹铁道"= 549,
    "航海王热血航线"= 504,
    "宝可梦大集结"= 493,
    "天地劫=幽城再临"= 448,
    "摩尔庄园手游"= 464,
    "坎公骑冠剑"= 442,
    "零号任务"= 508,
    "暗区突围"= 502,
    "综合棋牌"= 354,
    "决战！平安京"= 140,
    "游戏王=决斗链接"= 407,
    "无悔华夏"= 531,
    "天谕手游"= 408,
    "天涯明月刀手游"= 389,
    "战双帕弥什"= 293,
    "崩坏3"= 40,
    "公主连结Re=Dive"= 330,
    "狼人杀"= 41,
    "幻书启世录"= 411,
    "百闻牌"= 286,
    "火影忍者手游"= 292,
    "漫威对决"= 511,
    "四叶草剧场"= 418,
    "王者模拟战"= 280,
    "CF手游"= 333,
    "QQ飞车手游"= 154,
    "碧蓝航线"= 113,
    "自走棋手游"= 250,
    "三国杀移动版"= 352,
    "猫和老鼠手游"= 269,
    "影之诗"= 156,
    "剑网3指尖江湖"= 206,
    "DNF手游"= 343,
    "双生视界"= 290,
    "梦幻西游手游"= 342,
    "重装战姬"= 262,
    "明日之后"= 189,
    "蛋仔派对"= 571,
    "部落冲突=皇室战争"= 50,
    "少女前线"= 39,
    "解密游戏"= 42,
    "梦幻模拟战"= 178,
    "忍者必须死3"= 203,
    "BanG Dream"= 258,
    "非人学园"= 212,
    "雀姬"= 214,
    "跑跑卡丁车手游"= 265,
    "新游评测"= 274,
    "其他手游"= 98,
    "APEX英雄手游"= 506,
    "小动物之星"= 473,
    "暗黑破坏神=不朽"= 492,
    "机动战姬=聚变"= 449,
    "荒野乱斗"= 469,
    "鬼泣-巅峰之战"= 470,
    "刀剑神域黑衣剑士王牌"= 471,
    "漫威超级战争"= 478,
    "主机游戏"= 236,
    "永劫无间"= 443,
    "我的世界"= 216,
    "战地风云2042"= 534,
    "独立游戏"= 283,
    "怀旧游戏"= 237,
    "恐怖游戏"= 276,
    "战地5"= 221,
    "FORZA 极限竞速"= 302,
    "NBA2K"= 362,
    "只狼"= 245,
    " 帝国神话"= 556,
    "帝国时代4"= 548,
    "怪物猎人=世界"= 217,
    "光环=无限"= 559,
    "孤岛惊魂6"= 537,
    "弹幕互动游戏"= 460,
    "饥荒"= 218,
    "植物大战僵尸"= 309,
    "命运2"= 277,
    "使命召唤"= 282,
    "仙剑奇侠传七"= 540,
    "糖豆人"= 357,
    "灵魂筹码"= 223,
    "格斗游戏"= 433,
    "荒野大镖客2"= 226,
    "重生细胞"= 426,
    "精灵宝可梦"= 228,
    "刺客信条"= 227,
    "恐鬼症"= 387,
    "以撒"= 219,
    "双人成行"= 446,
    "方舟"= 295,
    "仁王2"= 313,
    "鬼泣5"= 244,
    "怪物猎人=崛起"= 412,
    "怪物猎人物语"= 481,
    "枪火重生"= 364,
    "策略游戏"= 570,
    "盗贼之海"= 341,
    "碳酸危机"= 503,
    "胡闹厨房"= 507,
    "斩妖行"= 358,
    "人间地狱"= 496,
    "体育游戏"= 500,
    "恐惧之间"= 439,
    "塞尔达"= 308,
    "米德加尔的部落"= 509,
    "马里奥制造2"= 261,
    "全境封锁2"= 243,
    "骑马与砍杀"= 326,
    "人类一败涂地"= 270,
    "鬼谷八荒"= 424,
    "无主之地3"= 273,
    "辐射76"= 220,
    "全面战争"= 257,
    "亿万僵尸"= 463,
    "暗黑破坏神2"= 535,
    "新世界"= 547,
    "光明记忆无限"= 552,
    "成长物语"= 553,
    "天命奇御二"= 560,
    "影子战术"= 564,
    "翼星求生"= 565,
    "Propnight"= 566,
    "创造！云岛工坊"= 569,
    "Unheard-疑案追声"= 246,
    "一起开火车！"= 272,
    "只只大冒险"= 324,
    "妄想破绽"= 483,
    "寄居隅怪奇事件簿"= 482,
    "重明鸟"= 484,
    "其他单机"= 235,
    "视频唱见"= 21,
    "萌宅领域"= 530,
    "视频聊天"= 145,
    "舞见"= 207,
    "户外"= 123,
    "日常"= 399,
    "放松电台"= 339,
    "唱见电台"= 190,
    "聊天电台"= 192,
    "配音"= 193,
    "虚拟主播"= 371,
    "美食"= 367,
    "萌宠"= 369,
    "时尚"= 378,
    "影音馆"= 33,
    "人文社科"= 376,
    "科技科普"= 375,
    "职业技能"= 377,
    "陪伴学习"= 372,
    "绘画"= 373,
    "游戏赛事"= 561,
    "体育赛事"= 562,
    "赛事综合"= 563,
    "跨年晚会"= 557
}