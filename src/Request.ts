import axios, { Method } from "axios";
import FormData from "form-data";
import {BiliCredential} from "./BiliCredential";

export class Request {
    static user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36";
    static referer = "https://www.bilibili.com";
    
    static async request(url: string, method: Method, params: Object = {}, data?: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        let headers = {
            "User-Agent": this.user_agent,
            "Referer": this.referer,
            "Cookie": "",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        if (credential) headers["Cookie"] = credential.cookie_str;
        if (data instanceof FormData) headers["Content-Type"] = data.getHeaders()["content-type"];

        return axios(url, {
            method: method,
            headers: headers,
            params: params,
            data: data
        }).then(res => {
            if (res.data.code !== 0) throw res.data;
            else return res.data;
        });
    }

    static async get(url: string, params: Object = {}, credential?: BiliCredential): Promise<any> {
        return this.request(url, "GET", params, {}, credential);
    }

    static async post(url: string, data: string | Object | FormData, credential?: BiliCredential): Promise<any> {
        return this.request(url, "POST", {}, data, credential);
    }

    static async head(url: string, params = {}, credential?: BiliCredential): Promise<any> {
        return this.request(url, "HEAD", {}, params, credential);
    }
}