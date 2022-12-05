import { URL } from "url";
import * as qrcode from "qrcode";
import { Request } from "./request";
import { BiliCredential } from "./biliCredential";
import { GetQRResp, GetLoginInfoSuccResp, GetLoginInfoFailResp } from "./types/login";

/**
 * 登录
 */
export class Login {
    constructor() { }

    /**
     * 获取二维码链接
     * @returns 
     */
    private static async _getQRcode(): Promise<GetQRResp> {
        return Request.get(
            "https://passport.bilibili.com/qrcode/getLoginUrl"
        ).then(res => res.data);
    }

    /**
     * 进行扫码登录
     * @param oauthKey 扫码登录秘钥
     * @returns 
     */
    private static async _getQRloginInfo(oauthKey: string)
        : Promise<GetLoginInfoSuccResp | GetLoginInfoFailResp> {
        return Request.post(
            "https://passport.bilibili.com/qrcode/getLoginInfo",
            { oauthKey }
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
    private static async _renderQR(
        text: string,
        output: "terminal" | "string" | "buffer")
        : Promise<void | string | Buffer> {
        switch (output) {
            case "string": return qrcode.toString(text);
            case "buffer": return qrcode.toBuffer(text);
            case "terminal": {
                console.log("打开手机进行扫码，请在3分钟内完成");
                console.log(await qrcode.toString(text));
                return;
            }
        }
    }

    /**
     * 扫码登录
     * @returns 
     */
    static async loginQR(
        output: "url" | "terminal" | "string" | "buffer" = "buffer",
        callback: (credential: BiliCredential) => any
    ): Promise<GetQRResp | string | void | Buffer> {
        const qr_info = await this._getQRcode();

        let count_down = 60;
        const polling = setTimeout(async (count_down) => {
            const res = await this._getQRloginInfo(qr_info.oauthKey);

            if ("url" in res) {
                clearInterval(polling);
                const params = new URL(res.url).searchParams;
                const sessdata = params.get("SESSDATA");
                const bili_jct = params.get("bili_jct");
                const uid = parseInt(params.get("DedeUserID") as string);
                const dedeUserID__ckMd5 = params.get("DedeUserID__ckMd5") as string;
                const refreshToken = res.refresh_token;
                if (!sessdata) throw "未取得SESSDATA";
                if (!bili_jct) throw "未取得bili_jct";
                console.log(uid, "已完成扫码登录");
                callback(new BiliCredential(sessdata, bili_jct,
                    { uid, refreshToken, dedeUserID__ckMd5, timestamp: res.timestamp }));
            }
            else {
                count_down--;
                if (count_down > 0) polling.refresh();
                else {
                    switch (res.data) {
                        case -1: throw "秘钥错误";
                        case -2: throw "密钥超时";
                        case -4: throw "未扫描";
                        case -5: throw "未确认";
                        default: throw "未知错误";
                    }
                }
            }
        }, 3000, count_down);

        if (output == "url") return qr_info;
        return Login._renderQR(qr_info.url, output);
    }
}