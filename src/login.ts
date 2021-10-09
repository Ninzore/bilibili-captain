import {URL} from "url";
import * as qrcode from "qrcode-terminal";
import {Request} from "./request";
import {BiliCredential} from "./biliCredential";
import {GetQRResp} from "./types/login";

export class Login {
    constructor() {}

    private static async _getQRcode(): Promise<GetQRResp> {
        return Request.get(
            "http://passport.bilibili.com/qrcode/getLoginUrl"
        ).then(res => res.data);
    }

    private static async _getQRloginInfo(oauthKey: string): Promise<any> {
        return Request.post(
            "http://passport.bilibili.com/qrcode/getLoginInfo",
            {oauthKey}
        );
    }

    static async loginQR(): Promise<BiliCredential> {
        const qr_info = await this._getQRcode();
        console.log("打开手机进行扫码，请在10秒内完成", qrcode.generate(qr_info.url, {small: true}));
        await new Promise(resolve => {
            setTimeout(() => {
                resolve("ok");
            }, 10000);
        });

        const res = await this._getQRloginInfo(qr_info.oauthKey);
        switch (res.data) {
            case -1: throw "秘钥错误";
            case -2: throw "密钥超时";
            case -4: throw "未扫描";
            case -5: throw "未确认";
            case 0: {
                const params = new URL(res.data.url).searchParams;
                const sessdata = params.get("SESSDATA");
                const bili_jct = params.get("bili_jct");
                if (!sessdata) throw "未取得SESSDATA";
                if (!bili_jct) throw "未取得bili_jct";
                return new BiliCredential(sessdata, bili_jct);
            };
            default: throw res.data;
        }
    }
}