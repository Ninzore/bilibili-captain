export interface GetQRResp {
    url:      string;
    oauthKey: string;
}

export interface GetLoginInfoResp {
    data: -1 | -2 | -4 | -5;
    url: string;
}