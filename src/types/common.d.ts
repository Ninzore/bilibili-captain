export type Btype = 
1 | 2 | 4 | 5 | 6 |
6 | 7 | 8 | 9 | 10 |
11 | 12 | 13 | 14 | 15 |
16 | 17 |18 | 19 | 20 |
21 | 22 | 33

export interface ParseAt {
    at_uids: string[];
    ctrl:    DynamicCtrl[];
}

export interface DynamicCtrl {
    location: number;
    type:     number;
    length:   number;
    data:     string;
}

export interface ResInfo {
    oid:   string;
    btype: Btype;
}

export interface baseResponse {
    code:    number;
    message: string;
    ttl:     number;
}

export interface UploadBfsResp {
    image_url:    string;
    image_width:  number;
    image_height: number;
}