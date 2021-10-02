export interface UserInfo {
    mid:              number;
    name:             string;
    sex:              string;
    face:             string;
    sign:             string;
    rank:             number;
    level:            number;
    jointime:         number;
    moral:            number;
    silence:          number;
    coins:            number;
    fans_badge:       boolean;
    fans_medal:       FansMedal;
    official:         Official;
    vip:              Vip;
    pendant:          Pendant;
    nameplate:        Nameplate;
    user_honour_info: UserHonourInfo;
    is_followed:      boolean;
    top_photo:        string;
    theme:            Theme;
    sys_notice:       SysNotice;
    live_room:        LiveRoom;
    birthday:         string;
    school:           School;
    profession:       Profession;
    tags:             null;
    series:           Series;
}

export interface MyInfoResp {
    mid:             number;
    name:            string;
    sex:             string;
    face:            string;
    sign:            string;
    rank:            number;
    level:           number;
    jointime:        number;
    moral:           number;
    silence:         number;
    email_status:    number;
    tel_status:      number;
    identification:  number;
    vip:             Vip;
    pendant:         Pendant;
    nameplate:       Nameplate;
    official:        Official;
    birthday:        number;
    is_tourist:      number;
    is_fake_account: number;
    pin_prompting:   number;
    is_deleted:      number;
    in_reg_audit:    number;
    is_rip_user:     boolean;
    profession:      MyInfoProfession;
    level_exp:       LevelExp;
    coins:           number;
    following:       number;
    follower:        number;
}

interface LevelExp {
    current_level: number;
    current_min:   number;
    current_exp:   number;
    next_exp:      number;
}

interface MyInfoProfession {
    id:        number;
    name:      string;
    show_name: string;
}

interface FansMedal {
    show:  boolean;
    wear:  boolean;
    medal: Medal;
}

interface Medal {
    uid:                number;
    target_id:          number;
    medal_id:           number;
    level:              number;
    medal_name:         string;
    medal_color:        number;
    intimacy:           number;
    next_intimacy:      number;
    day_limit:          number;
    today_feed:         number;
    medal_color_start:  number;
    medal_color_end:    number;
    medal_color_border: number;
    is_lighted:         number;
    light_status:       number;
    wearing_status:     number;
    score:              number;
}

export interface LiveRoom {
    roomStatus:     number;
    liveStatus:     number;
    url:            string;
    title:          string;
    cover:          string;
    online:         number;
    roomid:         number;
    roundStatus:    number;
    broadcast_type: number;
}

interface Official {
    role:  number;
    title: string;
    desc:  string;
    type:  number;
}

interface School {
    name: string;
}

interface Profession {
    name: string;
}

interface Series {
    user_upgrade_status: number;
    show_upgrade_window: boolean;
}

interface Theme {}

interface SysNotice {}

interface UserHonourInfo {
    mid:    number;
    colour: null;
    tags:   null;
}

interface Vip {
    type:                 number;
    status:               number;
    due_date:             number;
    vip_pay_type?:        number;
    theme_type:           number;
    label:                Label;
    avatar_subscript:     number;
    nickname_color:       string;
    role:                 number;
    avatar_subscript_url: string;
}

export interface Member {
    mid:             string;
    uname:           string;
    sex:             string;
    sign:            string;
    avatar:          string;
    rank:            string;
    DisplayRank:     string;
    level_info:      LevelInfo;
    pendant:         Pendant;
    nameplate:       Nameplate;
    official_verify: OfficialVerify;
    vip:             Vip2;
    fans_detail:     null;
    following:       number;
    is_followed:     number;
    user_sailing:    UserSailing;
    is_contractor:   boolean;
}

interface LevelInfo {
    current_level: number;
    current_min:   number;
    current_exp:   number;
    next_exp:      number;
}

interface Nameplate {
    nid:         number;
    name:        string;
    image:       string;
    image_small: string;
    level:       Level;
    condition:   string;
}

interface OfficialVerify {
    type: number;
    desc: string;
}

export interface Pendant {
    pid:                 number;
    name:                string;
    image:               string;
    expire:              number;
    image_enhance:       string;
    image_enhance_frame: string;
}

interface UserSailing {
    pendant:           null;
    cardbg:            null;
    cardbg_with_focus: null;
}

interface Vip2 {
    vipType:               number;
    vipDueDate:            number;
    dueRemark:             string;
    accessStatus:          number;
    vipStatus:             number;
    vipStatusWarn:         string;
    themeType:             number;
    label:                 Label;
    avatar_subscript:      number;
    avatar_subscript_url?: string;
    nickname_color:        string;
}

interface Label {
    path:         string;
    text:         string;
    label_theme:  string;
    text_color:   string;
    bg_style:     number;
    bg_color:     string;
    border_color: string;
}

export interface ContentMember {
    mid:             string;
    uname:           string;
    sex:             string;
    sign:            string;
    avatar:          string;
    rank:            string;
    DisplayRank:     string;
    level_info:      LevelInfo;
    pendant:         Pendant;
    nameplate:       Nameplate;
    official_verify: OfficialVerify;
    vip:             Vip2;
}

export interface UserInfoFromSearch {
    title:           string;
    cover:           string;
    uri:             string;
    param:           string;
    goto:            string;
    sign:            string;
    fans:            number;
    level:           number;
    official_verify: OfficialVerify;
    vip:             Vip;
    av_items:        AVItem[];
    is_up:           boolean;
    live_uri:        string;
    archives:        number;
    roomid:          number;
    mid:             number;
    live_link:       string;
    relation:        Relation;
}

interface AVItem {
    position:    number;
    title:       string;
    cover:       string;
    uri:         string;
    param:       string;
    goto:        string;
    play:        number;
    danmaku:     number;
    ctime:       number;
    ctime_label: string;
    duration:    string;
}

interface Relation {
    status: number;
}

export interface UserProfile {
    info:       Info;
    card:       UserProfileCard;
    vip:        Vip;
    pendant:    Pendant;
    rank:       string;
    sign:       string;
    level_info: LevelInfo2;
}

interface UserProfileCard {
    official_verify: OfficialVerify;
}


interface Info {
    uid:   number;
    uname: string;
    face:  string;
}

interface LevelInfo2 {
    current_level: number;
}


export interface Display {
    relation:         Relation2;
    add_on_card_info: AddOnCardInfo;
}

interface Relation2 {
    status:      number;
    is_follow:   number;
    is_followed: number;
}

export interface AddOnCardInfo {
    add_on_card_show_type: number;
    vote_card:             string;
}

export interface BatchUserInfosResp {
    mid:             string;
    uname:           string;
    sex:             number;
    sign:            string;
    rank:            number;
    DisplayRank:     string;
    level_info:      LevelInfo;
    pendant:         Pendant;
    nameplate:       Nameplate;
    official_verify: OfficialVerify;
    vip:             Vip3;
    uid:             number;
    face:            string;
}

enum Level {
    Empty = "",
    普通勋章 = "普通勋章",
    稀有勋章 = "稀有勋章",
    高级勋章 = "高级勋章",
}

interface Vip3 {
    vipType:       number;
    vipDueDate:    number;
    dueRemark:     string;
    accessStatus:  number;
    vipStatus:     number;
    vipStatusWarn: string;
    themeType:     number;
    label:         {path: string};
}