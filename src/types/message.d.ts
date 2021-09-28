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

interface Publisher {
    name: string;
    mid:  number;
    face: string;
}

interface Source {
    name: string;
    logo: string;
}

export interface MsgBoxResp {
    session_list:          SessionList[];
    has_more:              number;  // 1表示后面还有，0就没有了
    anti_disturb_cleaning: boolean;
    is_address_list_empty: number;
}

interface SessionList {
    talker_id:    number;  // 发信人uid
    session_type: number;  // 目前只见过1
    at_seqno:     number;
    top_ts:       number;
    group_name:   string;
    group_cover:  string;
    is_follow:    number;
    is_dnd:       number;
    ack_seqno:    number;
    ack_ts:       number;  // 被读取时间
    session_ts:   number;  // 发送时间
    unread_count: number;
    last_msg:     LastMsg;
    group_type:   number;
    can_fold:     number;
    status:       number;
    max_seqno:    number;
    new_push_msg: number;
    setting:      number;
    is_guardian:  number;
    is_intercept: number;
    is_trust:     number;
}

interface LastMsg {
    sender_uid:       number;
    receiver_type:    number;
    receiver_id:      number;
    msg_type:         number;
    content:          string;  // 消息内容在这里
    msg_seqno:        number;
    timestamp:        number;
    at_uids:          number[] | null;
    msg_key:          number;
    msg_status:       number;
    notify_code:      string;
    new_face_version: number;
}

export interface MessageFromResp {
    messages:  Message[];
    has_more:  number;
    min_seqno: number;
    max_seqno: number;
}

interface Message {
    sender_uid:        number;
    receiver_type:     number;
    receiver_id:       number;
    msg_type:          number;
    content:           string;
    msg_seqno:         number;
    timestamp:         number;
    at_uids:           number[];
    msg_key:           number;
    msg_status:        number;
    notify_code:       string;
    new_face_version?: number;
}

export interface SendMsgResp {
    msg_key:        number;
    msg_content?:   string;
    key_hit_infos?: {};
}