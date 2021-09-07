export interface PageListReturn {
    cid:       number;
    page:      number;
    from:      string;
    part:      string;
    duration:  number;
    vid:       string;
    weblink:   string;
    dimension: Dimension;
}

export interface VideoDetail {
    bvid:      string;
    aid:       number;
    videos:    number;
    tid:       number;
    tname:     string;
    copyright: number;
    pic:       string;
    title:     string;
    pubdate:   number;
    ctime:     number;
    desc:      string;
    desc_v2:   DescV2[];
    state:     number;
    duration:  number;
    rights:    { [key: string]: number };
    owner:     Owner;
    stat:      Stat;
    dynamic:   string;
    cid:       number;
    dimension: Dimension;
    no_cache:  boolean;
    pages:     Page[];
    subtitle:  Subtitle;
    user_garb: UserGarb;
}

interface DescV2 {
    raw_text: string;
    type:     number;
    biz_id:   number;
}

interface Dimension {
    width:  number;
    height: number;
    rotate: number;
}

interface Owner {
    mid:  number;
    name: string;
    face: string;
}

interface Page {
    cid:       number;
    page:      number;
    from:      string;
    part:      string;
    duration:  number;
    vid:       string;
    weblink:   string;
    dimension: Dimension;
}

interface Stat {
    aid:        number;
    view:       number;
    danmaku:    number;
    reply:      number;
    favorite:   number;
    coin:       number;
    share:      number;
    now_rank:   number;
    his_rank:   number;
    like:       number;
    dislike:    number;
    evaluation: string;
    argue_msg:  string;
}

export interface StatResponse {
    aid:        number;
    bvid:       string;
    view:       number;
    danmaku:    number;
    reply:      number;
    favorite:   number;
    coin:       number;
    share:      number;
    like:       number;
    now_rank:   number;
    his_rank:   number;
    no_reprint: number;
    copyright:  number;
    argue_msg:  string;
    evaluation: string;
}

interface Subtitle {
    allow_submit: boolean;
    list:         any[];
}

interface UserGarb {
    url_image_ani_cut: string;
}

export interface TripleResponse {
    coin:     boolean;
    fav:      boolean;
    like:     boolean;
    multiply: number;
}