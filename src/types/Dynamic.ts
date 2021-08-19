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
    code:    number;
    msg:     string;
    message: string;
    data: {
        result:         number;
        errmsg:         string;
        dynamic_id:     number;
        create_result:  number;
        dynamic_id_str: string;
        _gt_:           number;
    };
}

export interface RemoveResponse {
    code:    number;
    msg:     string;
    message: string;
    data:   {
        _gt_: number;
    };
}