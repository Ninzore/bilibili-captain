import { ReadStream } from "fs-extra";
import * as FormData from "form-data";
import { Request } from "./request";
import { readFile } from "./utils";
import { BiliCredential } from "./biliCredential";
import {
    BaseInfoResp, GetCoverListResp,
    LiveAreaListResp, LiveUserInfoResp, RoomInfoResp,
    SignResp, StartLiveResp, StopLiveResp,
    StreamAddrResp, UploadCoverResp,
} from "./types/live";
import { AreaIds } from "./types/areaList";

/**
 * 直播间相关
 */
export class Live {
    static areaIds = AreaIds;
    private credential: BiliCredential;
    liveUserInfo!: LiveUserInfoResp;
    liveRoomInfo!: RoomInfoResp;

    constructor(credential: BiliCredential, liveUserInfo?: LiveUserInfoResp, liveRoomInfo?: RoomInfoResp) {
        this.credential = credential;

        if (liveUserInfo) this.liveUserInfo = liveUserInfo;
        if (liveRoomInfo) this.liveRoomInfo = liveRoomInfo;
    }

    async init() {
        const userInfo = await this.credential.loadInfo();
        this.liveUserInfo = await this.selfInfo();
        this.liveRoomInfo = await Live.getRoomInfo(userInfo.live_room.roomid);
    }

    /**
     * 签到
     * @returns
     */
    async sign(): Promise<SignResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign",
            {}, this.credential,
        ).then(res => res.data);
    }

    /**
     * 个人信息，直播等级，瓜子电池之类的
     * @returns
     */
    async selfInfo(): Promise<LiveUserInfoResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info",
            {}, this.credential,
        ).then(res => res.data);
    }

    /**
     * 开播
     * @param area 直播分区代码
     * @param roomid 自己的房间号
     * @returns
     */
    async startLive(area: number): Promise<StartLiveResp> {
        return Request.post(
            "https://api.live.bilibili.com/room/v1/Room/startLive",
            {
                room_id: this.liveRoomInfo.room_id,
                platform: "pc",
                area_v2: area,
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 下播
     * @param roomid 自己的房间号
     * @returns
     */
    async stopLive(): Promise<StopLiveResp> {
        return Request.post(
            "https://api.live.bilibili.com/room/v1/Room/stopLive",
            {
                room_id: this.liveRoomInfo.room_id,
                platform: "pc",
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 获取，刷新推流地址
     * @param resetKey 是否刷新推流地址，默认false
     * @returns
     */
    async streamAddr(resetKey: false): Promise<StreamAddrResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/app-blink/v1/live/getWebUpStreamAddr",
            {
                platform: "pc",
                reset_key: resetKey,
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 主播公告
     * @param content 说说下次开播的时间和内容吧~
     * @returns
     */
    async updateRoomNews(content: string): Promise<boolean> {
        return Request.post(
            "https://api.live.bilibili.com/xlive/app-blink/v1/index/updateRoomNews",
            {
                room_id: this.liveRoomInfo.room_id,
                uid: this.credential.uid,
                content,
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr,
            },
            this.credential,
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
        interface UpdateForm {
            room_id: number,
            csrf_token: string,
            csrf: string,
            title?: string;
            description?: string;
            add_tag?: string;
            del_tag?: string;
        };

        const form: UpdateForm = {
            room_id: this.credential.info.live_room.roomid,
            csrf_token: this.credential.csfr,
            csrf: this.credential.csfr,
        };

        switch (manipulate) {
            case "title": form.title = content; break;
            case "description": form.description = content; break;
            case "add_tag": form.add_tag = content; break;
            case "del_tag": form.del_tag = content; break;
            default: throw new Error("操作错误");
        }

        return Request.post(
            "https://api.live.bilibili.com/room/v1/Room/update",
            form,
            this.credential,
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
     * @param addOrdel 新增或删除，默认为true/新增
     * @returns
     */
    async updateTag(tag: string, addOrdel: boolean): Promise<boolean> {
        return this._update(tag, addOrdel ? "add_tag" : "del_tag");
    }

    /**
     * 上传封面
     * @param cover 封面链接/buffer/stream
     * @returns
     */
    private async _uploadCover(cover: string | Buffer | ReadStream): Promise<UploadCoverResp> {
        if (typeof cover === "string") cover = await readFile(cover);

        const form = new FormData();
        form.append("file", cover);
        form.append("bucket", "live");
        form.append("dir", "new_room_cover");

        return Request.post(
            `https://api.bilibili.com/x/upload/web/image?csrf=${this.credential.csfr}`,
            form,
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 获取最新上传的封面状态，推荐用在updateCover后
     * @returns
     */
    async getNewCover(): Promise<GetCoverListResp> {
        return Request.get(
            "https://api.live.bilibili.com/room/v1/Cover/new_get_list",
            { room_id: this.liveRoomInfo.room_id },
            this.credential,
        ).then(res => res.data[0]);
    }

    /**
     * 获取自己直播间的封面列表
     * @returns 其中audit_status 判断是否过审，0=审核中，1=已过审，-1=没过审
     */
    async getCoverList(): Promise<GetCoverListResp[]> {
        return Request.get(
            "https://api.live.bilibili.com/room/v1/Cover/get_list",
            {
                room_id: this.liveRoomInfo.room_id,
                type: "all_cover",
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 修改封面
     * @param cover 图片，最小为960*540 (16:9)，颜值区封面为500*500
     * @param coverType 普通直播 = cover， 颜值区 = show，默认为普通
     * @returns
     */
    async updateCover(cover: string | Buffer | ReadStream, coverType: "cover" | "show" = "cover"): Promise<boolean> {
        const covers = await this.getCoverList();
        let picId = 0;
        for (const cover of covers) {
            if (cover.type === coverType) picId = cover.id;
        }
        if (picId === 0) throw new Error("目前没有直播封面无法替换");

        const imgUrl = (await this._uploadCover(cover)).location;

        // addCoverApi = /room/v1/Cover/add  添加封面
        return Request.post(
            coverType === "cover"
                ? "https://api.live.bilibili.com/room/v1/Cover/new_replace_cover" // 普通直播
                : "https://api.live.bilibili.com/room/v1/Cover/replace", //  颜值区
            {
                room_id: this.liveRoomInfo.room_id,
                url: imgUrl,
                pic_id: picId,
                type: coverType,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
                visit_id: "",
            },
            this.credential,
        ).then(res => res.data.code === 0);
    }

    /**
     * 获取房间信息
     * @param id 房间号或主播id
     * @param idType id类型为uid或roomid
     * @returns
     */
    static async getRoomBaseInfo(id: number, idType: "uid" | "roomid"): Promise<BaseInfoResp> {
        return Request.get(
            "https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo",
            {
                [idType === "uid" ? "uids" : "room_ids"]: id,
                req_biz: "space",
            },
        ).then(res => {
            const values = Object.values(
                idType === "uid" ? res.data.by_uids : res.data.by_room_ids)[0];
            if (!values) throw new Error("没有这个房间号");
            else return values as BaseInfoResp;
        });
    }

    /**
     * 获取房间更详细信息
     * @param roomId 房间号
     * @returns
     */
    static async getRoomInfo(roomId: number): Promise<RoomInfoResp> {
        return Request.get(
            "https://api.live.bilibili.com/room/v1/Room/get_info",
            {
                room_id: roomId,
                from: "space",
            },
        ).then(res => res.data);
    }

    /**
     * 获取直播分区列表
     * @returns
     */
    static async getAreaList(): Promise<LiveAreaListResp[]> {
        return Request.get(
            "https://api.live.bilibili.com/room/v1/Area/getList",
        ).then(res => res.data);
    }
}
