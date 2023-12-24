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
    name: string;
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
    complex_area_name: string;
    parent_name:       string;
    area_type:         number;
    cate_id?:          string;
}

export interface GetCoverListResp {
    id:            number;
    audit_status:  number;
    audit_reason:  string;
    url:           string;
    select_status: number;
    type:          string;
}
