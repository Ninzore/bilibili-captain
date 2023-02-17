/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-02-17 17:58:59
 * @LastEditTime: 2023-02-17 18:21:28
 * @LastEditors: 14K
 */
import { Request } from "./request";
import { BiliCredential } from "./biliCredential";
import {
    DanmakuData,
    SendDanmakuResp
} from "./types/danmaku";
/**
 * 发送弹幕
 */
export class Danmaku {
    constructor(public credential: BiliCredential) {}
    async sendDanmaku(danmaku: DanmakuData): Promise<SendDanmakuResp> {
        if (!danmaku.roomid) throw new DanmakuError("缺少发送的房间号");
        if (!danmaku.msg) throw new DanmakuError("缺少发送消息");
        return Request.post(
            "https://api.live.bilibili.com/msg/send",
            {
                csrf_token: this.credential.csfr,
                bubble: 0,
                csrf: this.credential.csfr,
                fontsize: danmaku.fontsize || "24",
                color: danmaku.color || "16777215",
                msg: danmaku.msg,
                rnd: Math.ceil(new Date().getTime()/1000),
                mode: 1,
                roomid: danmaku.roomid,
            }
            , this.credential,
        ).then(res => {
            return res.data;
        });
    }
}

class DanmakuError extends Error {
    name = "DanmakuError"
}