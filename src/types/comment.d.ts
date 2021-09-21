import {Member, ContentMember} from "./user";

declare const enum SortBy {
    time,
    like,
    replyNum
}

interface AddResponse {
    success_action:  number;
    success_toast:   string;
    need_captcha:    boolean;
    need_captcha_v2: boolean;
    url:             string;
    url_v2:          string;
    rpid:            number;
    rpid_str:        string;
    dialog:          number;
    dialog_str:      string;
    root:            number;
    root_str:        string;
    parent:          number;
    parent_str:      string;
    reply:           Reply;
}

export interface ListResponse {
    page:         Page;
    config:       Config;
    replies:      Reply[];
    hots:         Reply[];
    upper:        Upper;
    top:          null;
    notice:       null;
    vote:         number;
    blacklist:    number;
    assist:       number;
    mode:         number;
    support_mode: number[];
    folder:       Folder;
    lottery_card: null;
    show_bvid:    boolean;
    control:      Control;
}

interface Config {
    showadmin:    number;
    showentry:    number;
    showfloor:    number;
    showtopic:    number;
    show_up_flag: boolean;
    read_only:    boolean;
    show_del_log: boolean;
}

interface Control {
    input_disable:            boolean;
    root_input_text:          string;
    child_input_text:         string;
    giveup_input_text:        string;
    bg_text:                  string;
    web_selection:            boolean;
    answer_guide_text:        string;
    answer_guide_icon_url:    string;
    answer_guide_ios_url:     string;
    answer_guide_android_url: string;
    show_type:                number;
    show_text:                string;
}

interface Page {
    num:    number;
    size:   number;
    count:  number;
    acount: number;
}

interface Upper {
    mid:  number;
    top:  null;
    vote: null;
}

export interface Reply {
    rpid:          number;
    oid:           number;
    type:          number;
    mid:           number;
    root:          number;
    parent:        number;
    dialog:        number;
    count:         number;
    rcount:        number;
    state:         number;
    fansgrade:     number;
    attr:          number;
    ctime:         number;
    rpid_str:      string;
    root_str:      string;
    parent_str:    string;
    like:          number;
    action:        number;
    member:        Member;
    content:       Content;
    replies:       Reply[];
    assist:        number;
    folder:        Folder;
    up_action:     UpAction;
    show_follow:   boolean;
    invisible:     boolean;
    reply_control: ReplyControl;
}

interface Content {
    message:  string;
    plat:     number;
    device:   string;
    members:  ContentMember[];
    jump_url: JumpURL;
    max_line: number;
}

interface JumpURL {
    [key: string]: briefVideoInfo;
}

interface briefVideoInfo {
    title:            string;
    state:            number;
    prefix_icon:      string;
    app_url_schema:   string;
    app_name:         string;
    app_package_name: string;
    click_report:     string;
    is_half_screen:   boolean;
    exposure_report:  string;
}

interface Folder {
    has_folded: boolean;
    is_folded:  boolean;
    rule:       string;
}

interface ReplyControl {
    sub_reply_entry_text: string;
    sub_reply_title_text: string;
}

interface UpAction {
    like:  boolean;
    reply: boolean;
}

export interface CommonResponse {
    code:    number;
    message: string;
    ttl:     number;
    data?:    Data;
}

interface Data {
    suc_pic:   string;
    suc_toast: string;
}
