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