import { URL } from "url";
import * as qrcode from "qrcode";
import { Request } from "./request";
import { BiliCredential } from "./biliCredential";
import { GetLoginInfoFailResp, GetLoginInfoSuccResp, GetQRResp } from "./types/login";

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
            "https://passport.bilibili.com/qrcode/getLoginUrl",
        ).then(res => res.data);
    }

    /**
     * 进行扫码登录
     * @param oauthKey 扫码登录秘钥
     * @returns
     */
    private static async _getQRloginInfo(oauthKey: string): Promise<GetLoginInfoSuccResp | GetLoginInfoFailResp> {
        return Request.post(
            "https://passport.bilibili.com/qrcode/getLoginInfo",
            { oauthKey },
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
        output: "terminal" | "string" | "buffer"): Promise<void | string | Buffer> {
        switch (output) {
            case "string": return qrcode.toString(text);
            case "buffer": return qrcode.toBuffer(text);
            case "terminal": {
                console.log("打开手机进行扫码，请在3分钟内完成");
                console.log(await qrcode.toString(text));
            }
        }
    }

    /**
     * 扫码登录
     * @returns
     */
    static async loginQR(
        output: "url" | "terminal" | "string" | "buffer" = "buffer",
        callback: (credential: BiliCredential) => any = function () { },
    ): Promise<GetQRResp | string | void | Buffer> {
        const qrInfo = await this._getQRcode();

        const countDown = 60;
        const polling = setTimeout(async (countDown) => {
            const res = await this._getQRloginInfo(qrInfo.oauthKey);

            if ("url" in res) {
                clearInterval(polling);
                const params = new URL(res.url).searchParams;
                const sessdata = params.get("SESSDATA");
                const biliJct = params.get("bili_jct");
                const uid = parseInt(params.get("DedeUserID") as string);
                const dedeUserIdCkMd5 = params.get("DedeUserID__ckMd5") as string;
                const refreshToken = res.refresh_token;
                if (!sessdata) throw new BiliCaptainError("未取得SESSDATA");
                if (!biliJct) throw new BiliCaptainError("未取得bili_jct");
                console.log(uid, "已完成扫码登录");
                callback(new BiliCredential(sessdata, biliJct,
                    { uid, refreshToken, dedeUserIdCkMd5, timestamp: res.timestamp }));
            }
            else {
                countDown--;
                if (countDown > 0) polling.refresh();
                else {
                    switch (res.data) {
                        case -1: throw new BiliCaptainError("秘钥错误");
                        case -2: throw new BiliCaptainError("密钥超时");
                        case -4: throw new BiliCaptainError("未扫描");
                        case -5: throw new BiliCaptainError("未确认");
                        default: throw new BiliCaptainError("未知错误");
                    }
                }
            }
        }, 3000, countDown);

        if (output === "url") return qrInfo;
        return Login._renderQR(qrInfo.url, output);
    }
}
