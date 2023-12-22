export interface GetQRResp {
    url: string;
    qrcode_key: string;
}

export interface GetLoginInfoResp {
    code: number;
    message: string;
    refresh_token: string;
    timestamp: number;
    url: string;
}
