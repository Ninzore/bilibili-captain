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