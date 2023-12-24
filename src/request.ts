import axios, { Method } from "axios";
import * as FormData from "form-data";
import * as qs from "qs";
import { BiliCredential } from "./biliCredential";
import { wbiSign } from "./sign";

/**
 * 请求
 */
export class Request {
    static userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36";
    static referer = "https://www.bilibili.com";

    static async request(url: string, method: Method, params: Object = {},
        data?: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        const headers = {
            "User-Agent": this.userAgent,
            "Referer": this.referer,
            "Cookie": credential ? credential.cookieStr : "",
            "Content-Type": data instanceof FormData
                ? data.getHeaders()["content-type"] : "application/x-www-form-urlencoded",
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
}
