import axios, { Method } from "axios";
import * as FormData from "form-data";
import * as qs from "qs";
import { BiliCredential } from "./biliCredential";

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

    static async get(url: string, params: Object = {}, credential?: BiliCredential): Promise<any> {
        return this.request(url, "GET", params, {}, credential);
    }

    static async post(url: string, data: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        if (!(data instanceof FormData)) data = qs.stringify(data);
        return this.request(url, "POST", {}, data, credential);
    }

    static async head(url: string, params = {}, credential?: BiliCredential): Promise<any> {
        return this.request(url, "HEAD", {}, params, credential);
    }
}
