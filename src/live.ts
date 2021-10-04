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
            {
                room_id: roomid || this.credential.info.liveroom?.roomid,
                platform: "pc",
                area_v2: area,
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            },
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
            {
                room_id: roomid || this.credential.info.liveroom?.roomid,
                platform: "pc",
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            },
            this.credential
        ).then(res => res.data);
    }

    /**
     * 获取，刷新推流地址
     * @param reset_key 是否刷新推流地址，默认false
     * @returns 
     */
    async streamAddr(reset_key: false): Promise<StreamAddrResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/app-blink/v1/live/getWebUpStreamAddr",
            {
                platform: "web",
                reset_key
            },
            this.credential
        ).then(res => res.data);
    }

    /**
     * 主播公告
     * @param content 说说下次开播的时间和内容吧~
     * @returns 
     */
    async updateRoomNews(content: string): Promise<boolean> {
        if (!this.credential.uid) throw "未能获取自己uid";
        if (!this.credential.info.liveroom?.roomid) throw "未能获取自己的房间号";

        return Request.get(
            "https://api.live.bilibili.com/xlive/app-blink/v1/index/updateRoomNews",
            {
                room_id: this.credential.info.liveroom.roomid,
                uid: this.credential.uid,
                content: content,
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            },
            this.credential
        ).then(res => res.code === 0);
    }

    /**
     * 修改直播间信息
     * @param content 标签名称
     * @param manipulate 操作内容，标题=title，简介=description，新增标签=add_tag，删除标签=del_tag
     * @returns 
     */
    private async _update(content: string, 
    manipulate: "title" | "description" | "add_tag" | "del_tag"): Promise<boolean> {
        if (!this.credential.info.liveroom?.roomid) throw "未能获取自己的房间号";

        interface UpdateForm {
            room_id: number,
            csrf_token: string,
            csrf: string,
            title?: string;
            description?: string;
            add_tag?: string;
            del_tag?: string;
        };

        let form:UpdateForm = {
            room_id: this.credential.info.liveroom.roomid,
            csrf_token: this.credential.csfr,
            csrf: this.credential.csfr
        }

        switch (manipulate) {
            case "title": form.title = content; break;
            case "description": form.description = content; break;
            case "add_tag": form.add_tag = content; break;
            case "del_tag": form.del_tag = content; break;
            default: throw "操作错误";
        }

        return Request.post(
            "https://api.live.bilibili.com/room/v1/Room/update",
            form,
            this.credential
        ).then(res => res.code === 0);
    }

    /**
     * 修改房间标题
     * @param title 标题
     * @returns 
     */
    async updateTitle(title: string): Promise<boolean> {
        return this._update(title, "title");
    }

    /**
     * 修改个人简介
     * @param desc 请输入你的个人简介~
     * @returns 
     */
    async updateDesc(desc: string): Promise<boolean> {
        return this._update(desc, "description");
    }

    /**
     * 更新tag
     * @param tag tag内容
     * @param add_del 新增或删除，默认为true/新增
     * @returns 
     */
     async updateTag(tag: string, add_del: boolean): Promise<boolean> {
        return this._update(tag, add_del ? "add_tag" : "del_tag");
    }
}