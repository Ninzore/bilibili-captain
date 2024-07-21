import axios, { Method } from "axios";
import * as FormData from "form-data";
import * as qs from "qs";
import { BiliCredential } from "./biliCredential";
import { wbiSign } from "./sign";

/**
 * 请求
 */
export class Request {
    static userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    static referer = "https://www.bilibili.com";
    static dmCoverImgStr = Request.encodeDmStr("ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 (0x00002684) Direct3D11 vs_5_0 ps_5_0, D3D11)Google Inc. (NVIDIA)");
    static dmImgStr = Request.encodeDmStr("WebGL 1.0 (OpenGL ES 2.0 Chromium)");

    static async request(url: string, method: Method, params: Object = {},
        data?: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        const headers = {
            "User-Agent": this.userAgent,
            "Referer": this.referer,
            "Cookie": credential ? credential.cookieStr : "",
            "Content-Type": data instanceof FormData
                ? data.getHeaders()["content-type"] : "application/x-www-form-urlencoded",
            "dm_cover_img_str": Request.dmCoverImgStr,
            "dm_img_list": [],
            "dm_img_str": Request.dmImgStr,
        };

        return axios(url, {
            method,
            headers,
            params,
            data,
        }).then(res => {
            if (res.data.code !== 0) throw res.data;
            else return res.data;
        });
    }

    static async get(url: string, params: object = {},
        extra?: BiliCredential | { credential?: BiliCredential, sign: string },
    ): Promise<any> {
        if (extra instanceof BiliCredential) {
            return this.request(url, "GET", params, {}, extra);
        }
        else if (typeof extra === "object") {
            if (extra.sign) params = await wbiSign(params);
            return extra.credential
                ? this.request(url, "GET", params, {}, extra.credential)
                : this.request(url, "GET", params);
        }
        else return this.request(url, "GET", params);
    }

    static async post(url: string, data: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        if (!(data instanceof FormData)) data = qs.stringify(data);
        return this.request(url, "POST", {}, data, credential);
    }

    static async head(url: string, params = {}, credential?: BiliCredential): Promise<any> {
        return this.request(url, "HEAD", {}, params, credential);
    }

    static cookiesParser(cookieStr: string): Object {
        const cookies: { [key: string]: string; } = {};
        cookieStr.split("; ").forEach(cookie => {
            const [key, value] = cookie.split("=");
            cookies[key] = value;
        });
        return cookies;
    }

    static encodeDmStr(str: string): string {
        const b64Value = Buffer.from(str).toString("base64");
        return b64Value.substring(0, b64Value.length - 2);
    };
}
