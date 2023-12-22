import { URL } from "url";
import * as qrcode from "qrcode";
import { Request } from "./request";
import { BiliCredential } from "./biliCredential";
import { GetLoginInfoResp, GetQRResp } from "./types/login";

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
            "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
        ).then(res => res.data);
    }

    /**
     * 进行扫码登录
     * @param qrcodeKey 扫码登录秘钥
     * @returns
     */
    private static async _getQRloginInfo(qrcodeKey: string): Promise<GetLoginInfoResp> {
        return Request.get(
            "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
            { qrcode_key: qrcodeKey },
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
        const { url: qrUrl, qrcode_key: qrcodeKey } = await this._getQRcode();
        const countDown = 60;

        const polling = setTimeout(async (countDown) => {
            const res = await this._getQRloginInfo(qrcodeKey);
            const { code, message, refresh_token: refreshToken } = res;

            if (code === 0 && "url" in res) {
                clearInterval(polling);
                const params = new URL(res.url).searchParams;
                const sessdata = params.get("SESSDATA");
                const biliJct = params.get("bili_jct");
                const uid = parseInt(params.get("DedeUserID") as string);
                const dedeUserIdCkMd5 = params.get("DedeUserID__ckMd5") as string;
                if (!sessdata) throw new Error("未取得SESSDATA");
                if (!biliJct) throw new Error("未取得bili_jct");
                console.log(uid, "已完成扫码登录");
                callback(new BiliCredential(sessdata, biliJct,
                    { uid, refreshToken, dedeUserIdCkMd5, timestamp: res.timestamp }));
            }
            else if (code === 86038) throw new Error("二维码已失效");
            else {
                countDown--;
                if (countDown > 0) {
                    polling.refresh();
                    console.log(`loginQR code = ${code}, message = ${message}`);
                }
                else {
                    throw new Error(`loginQR Error: code = ${code}, message = ${message}`);
                }
            }
        }, 3000, countDown);

        if (output === "url") return qrUrl;
        return Login._renderQR(qrUrl, output);
    }
}
