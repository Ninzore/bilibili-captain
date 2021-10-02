import * as qs from "qs";
import {Request} from "./request";
import {BiliCredential} from "./biliCredential";
import {SignResp, LiveUserInfoResp, 
    StartLiveResp, StopLiveResp,
    StreamAddrResp} from "./types/live";

export class Live {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 签到
     * @returns 
     */
    async sign(): Promise<SignResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign",
            {}, this.credential
        ).then(res => res.data);
    }

    /**
     * 个人信息，直播等级，瓜子电池之类的
     * @returns 
     */
    async selfInfo(): Promise<LiveUserInfoResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info",
            {}, this.credential
        ).then(res => res.data);
    }

    /**
     * 开播
     * @param area 直播分区代码
     * @param roomid 自己的房间号
     * @returns 
     */
    async startLive(area: number, roomid?: number): Promise<StartLiveResp> {
        if (!roomid && !this.credential.info.liveroom?.roomid) throw "未能获取自己的房间号";

        return Request.post(
            "http://api.live.bilibili.com/room/v1/Room/startLive",
            qs.stringify({
                room_id: roomid || this.credential.info.liveroom?.roomid,
                platform: "pc",
                area_v2: area,
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => res.data);
    }

    /**
     * 下播
     * @param roomid 自己的房间号
     * @returns 
     */
    async stopLive(roomid?: number): Promise<StopLiveResp> {
        if (!roomid && !this.credential.info.liveroom?.roomid) throw "未能获取自己的房间号";

        return Request.post(
            "https://api.live.bilibili.com/room/v1/Room/stopLive",
            qs.stringify({
                room_id: roomid || this.credential.info.liveroom?.roomid,
                platform: "pc",
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => res.data);
    }

    /**
     * 获取推流地址
     * @returns 
     */
    async streamAddr(): Promise<StreamAddrResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/app-blink/v1/live/getWebUpStreamAddr",
            {platform: "web"},
            this.credential
        ).then(res => res.data);
    }
}