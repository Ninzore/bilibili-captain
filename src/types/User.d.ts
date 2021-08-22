export interface User {
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

interface LiveRoom {
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
    vip_pay_type:         number;
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
    level:       string;
    condition:   string;
}

interface OfficialVerify {
    type: number;
    desc: string;
}

interface Pendant {
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
    vip:             ContentMemberVip;
}