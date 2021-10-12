import {URL} from "url";
import * as qrcode from "qrcode";
import {Request} from "./request";
import {BiliCredential} from "./biliCredential";
import {GetQRResp, GetLoginInfoResp} from "./types/login";

/**
 * 登录
 */
export class Login {
    constructor() {}

    /**
     * 获取二维码链接
     * @returns 
     */
    private static async _getQRcode(): Promise<GetQRResp> {
        return Request.get(
            "http://passport.bilibili.com/qrcode/getLoginUrl"
        ).then(res => res.data);
    }

    /**
     * 进行扫码登录
     * @param oauthKey 扫码登录秘钥
     * @returns 
     */
    private static async _getQRloginInfo(oauthKey: string): Promise<GetLoginInfoResp> {
        return Request.post(
            "http://passport.bilibili.com/qrcode/getLoginInfo",
            {oauthKey}
        )
        .then(res => res.data)
        .catch(err => {
            if (err.data) return err;
            else throw err;
        });
    }

    /**
     * 输出QRcode渲染结果
     * @param output 选择输出形式
     */
    static async renderQR(text: string, output: "buffer"): Promise<Buffer>
    static async renderQR(text: string, output: "string"): Promise<string>
    static async renderQR(text: string, output: "terminal"): Promise<void>
    static async renderQR(text: string, output: "terminal" | "string" | "buffer"): Promise<void | string | Buffer> {
        switch (output) {
            case "string": return qrcode.toString(text);
            case "buffer": return qrcode.toBuffer(text);
            case "terminal": {
                console.log(await qrcode.toString(text));
                return;
            }
        }
    }

    /**
     * 扫码登录
     * @returns 
     */
    static async loginQR(): Promise<BiliCredential> {
        const qr_info = await this._getQRcode();
        console.log("打开手机进行扫码，请在3分钟内完成");
        Login.renderQR(qr_info.url, "terminal");

        return new Promise(resolve => {
            let last_stat = -1;
            let clear: ReturnType<typeof setTimeout>;

            const polling = setInterval(async () => {
                const res = await this._getQRloginInfo(qr_info.oauthKey);
                
                if (res.url) {
                    last_stat = 0;
                    clearInterval(polling);
                    clearTimeout(clear);
                    const params = new URL(res.url).searchParams;
                    const sessdata = params.get("SESSDATA");
                    const bili_jct = params.get("bili_jct");
                    if (!sessdata) throw "未取得SESSDATA";
                    if (!bili_jct) throw "未取得bili_jct";
                    console.log("已完成扫码登录");
                    resolve(new BiliCredential(sessdata, bili_jct));
                }
                else last_stat = res.data;
            }, 3000);

            clear = setTimeout(polling => {
                if (last_stat !== 0) clearInterval(polling);
                switch (last_stat) {
                    case 0: return;
                    case -1: throw "秘钥错误";
                    case -2: throw "密钥超时";
                    case -4: throw "未扫描";
                    case -5: throw "未确认";
                    default: throw "未知错误";
                }
            }, 180000, polling);
        });
    }
}