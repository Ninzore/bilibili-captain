export interface GetQRResp {
    url:      string;
    oauthKey: string;
}

export interface GetLoginInfoSuccResp {
    url: string;
    refresh_token: string;
    timestamp: number;
}

export interface GetLoginInfoFailResp {
    data: -1 | -2 | -4 | -5;
}