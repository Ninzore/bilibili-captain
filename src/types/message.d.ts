export interface UnreadMsgCountResp {
    code:    number;
    message: string;
    ttl:     number;
    data:    Data;
}

interface UnreadMsgCountData {
    at:      number;
    chat:    number;
    like:    number;
    reply:   number;
    sys_msg: number;
    up:      number;
}


export interface UnreadPrivateMsgCountResp {
    code:    number;
    msg:     string;
    message: string;
    ttl:     number;
    data:    UnreadMessageCountData;
}

interface UnreadPrivateMsgCountData {
    unfollow_unread:   number;
    follow_unread:     number;
    unfollow_push_msg: number;
    dustbin_push_msg:  number;
    dustbin_unread:    number;
}

export interface ReplyMsgResp {
    cursor:       Cursor;
    items:        ItemElement[];
    last_view_at: number;
}

interface Cursor {
    is_end: boolean;
    id:     number;
    time:   number;
}

interface ItemElement {
    id:         number;
    user:       ItemUser;
    item:       ItemItem;
    counts:     number;
    is_multi:   number;
    reply_time: number;
}

interface ItemItem {
    subject_id:           number;
    root_id:              number;
    source_id:            number;
    target_id:            number;
    type:                 string;
    business_id:          number;
    business:             Business;
    title:                string;
    desc:                 string;
    image:                string;
    uri:                  string;
    native_uri:           string;
    detail_title:         string;
    root_reply_content:   string;
    source_content:       string;
    target_reply_content: string;
    at_details:           any[];
    topic_details:        any[];
    hide_reply_button:    boolean;
    hide_like_button:     boolean;
    like_state:           number;
    danmu:                null;
}

interface ItemUser {
    mid:      number;
    fans:     number;
    nickname: string;
    avatar:   string;
    mid_link: string;
    follow:   boolean;
}

export interface LikeResp {
    latest: Latest;
    total:  Total;
}

export interface Latest {
    items:        LikeItemElement[];
    last_view_at: number;
}

interface LikeItemElement {
    id:           number;
    users:        ItemUser[];
    item:         LikeItemItem;
    counts:       number;
    like_time:    number;
    notice_state: number;
}

interface LikeItemItem {
    item_id:           number;
    pid:               number;
    type:              LikeType;
    business:          Business;
    business_id:       number;
    reply_business_id: number;
    like_business_id:  number;
    title:             string;
    desc:              string;
    image:             string;
    uri:               string;
    detail_name:       string;
    native_uri:        string;
    ctime:             number;
}

enum Business {
    动态 = "动态",
    弹幕 = "弹幕",
    评论 = "评论",
}

enum LikeType {
    Album = "album",
    Danmu = "danmu",
    Dynamic = "dynamic",
    Reply = "reply",
}

interface Total {
    cursor: Cursor;
    items:  LikeItemElement[];
}

interface Cursor {
    is_end: boolean;
    id:     number;
    time:   number;
}

export interface SysMsgResp {
    id:               number;
    cursor:           number;
    type:             number;
    title:            string;
    content:          string;
    source:           Source;
    time_at:          string;
    card_type:        number;
    card_brief:       string;
    card_msg_brief:   string;
    card_cover:       string;
    card_story_title: string;
    card_link:        string;
    mc:               string;
    is_station:       number;
    is_send:          number;
    notify_cursor:    number;
    publisher?:       Publisher;
}

export interface Publisher {
    name: string;
    mid:  number;
    face: string;
}

export interface Source {
    name: string;
    logo: string;
}