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