import {UserProfile, Display} from "./User";

export interface UploadBfsResponse {
    code:    number;
    message: string;
    ttl:     number;
    data: {
        image_url:    string;
        image_width:  number;
        image_height: number;
    };
}

export interface CreateResponse {
    result:         number;
    errmsg:         string;
    create_result:  number;
    dynamic_id:     number;
    dynamic_id_str: string;
    _gt_:           number;
}

export interface CreateDraftResponse {
    errmsg:   string;
    draft_id: number;
    _gt_:     number;
}

export interface PublishDraftResponse {
    result:         number;
    errmsg:         string;
    create_ec:      number;
    dynamic_id:     number;
    dynamic_id_str: string;
    _gt_:           number;
}

export interface RmDraftResponse {
    errmsg:   string;
    _gt_:     number;
}

export interface GetDraftsResponse {
    drafts: Draft[];
    _gt_:   number;
}

interface GetDraftsResponse {
    draft_id:       number;
    uid:            number;
    type:           number;
    publish_time:   number;
    request:        string;
    update_time:    number;
    publish_status: number;
    error_code:     number;
    error_msg:      string;
    user_profile:   UserProfile;
}

export interface RepostResponse {
    result: number;
    errmsg: string;
    _gt_:   number;
}

export interface DynamiDetail {
    card:   DataCard;
    result: number;
    _gt_:   number;
}

interface DataCard {
    desc:        Desc;
    card:        string;
    extend_json: string;
    display:     Display;
}

interface Desc {
    uid:            number;
    type:           number;
    rid:            number;
    acl:            number;
    view:           number;
    repost:         number;
    comment:        number;
    like:           number;
    is_liked:       number;
    dynamic_id:     number;
    timestamp:      number;
    pre_dy_id:      number;
    orig_dy_id:     number;
    orig_type:      number;
    user_profile:   UserProfile;
    uid_type:       number;
    stype:          number;
    r_type:         number;
    inner_id:       number;
    status:         number;
    dynamic_id_str: string;
    pre_dy_id_str:  string;
    orig_dy_id_str: string;
    rid_str:        string;
}