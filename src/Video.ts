import * as querystring from "query-string";
import {BiliCredential} from "./BiliCredential";
import {Request} from "./Request";
import { StatResponse, PageListReturn, VideoDetail, TripleResponse } from "./types/Video";

export class Video {
    private credential: BiliCredential;
    
    constructor(credential: BiliCredential, public bvid?: string) {
        this.credential = credential;
    }
    
    /**
     * 获取视频详细信息
     * @param bvid 
     * @returns 
     */
    async detail(bvid?: string): Promise<VideoDetail> {
        bvid = bvid || this.bvid;
        if (!bvid) throw "需要提供bvid";
        return Request.get(
            "http://api.bilibili.com/x/web-interface/view",
            {bvid},
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 获取视频详细信息, 此方法无法查看隐藏内容
     * @param bvid 
     * @returns 
     */
    static async detail(bvid: string): Promise<VideoDetail> {
        return Request.get(
            "http://api.bilibili.com/x/web-interface/view",
            {bvid}
        ).then(res => {return res.data;});
    }

    /**
     * 获取视频简介
     * @param bvid 
     * @returns 
     */
    static async desc(bvid: string): Promise<string> {
        return Request.get(
            "http://api.bilibili.com/x/web-interface/archive/desc",
            {bvid}
        ).then(res => {return res.data;});
    }

    /**
     * 视频状态
     * @param bvid 
     * @returns 
     */
    static async stat(bvid: string): Promise<StatResponse> {
        return Request.get(
            "https://api.bilibili.com/x/web-interface/archive/stat",
            {bvid}
        ).then(res => {return res.data;});
    }
    async stat(bvid?: string): Promise<StatResponse> {
        bvid = bvid || this.bvid;
        if (!bvid) throw "需要提供bvid";
        return Video.stat(bvid);
    }

    /**
     * 查询视频分P列表
     * @param bvid 
     * @returns 
     */
    static async pagelist(bvid: string): Promise<PageListReturn[]> {
        return Request.get(
            "http://api.bilibili.com/x/player/pagelist",
            {bvid}
        ).then(res => {return res.data;});
    }

    /**
     * 
     * @param like 
     * @param bvid 
     * @returns 
     */
    async like(like: true, bvid?: string): Promise<boolean> {
        bvid = bvid || this.bvid;
        if (!bvid) throw "需要提供bvid";
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb",
            querystring.stringify({
                bvid,
                like,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.code === 0});
    }

    /**
     * 投币
     * @param bvid 
     * @param multiply 个数（最多2个）
     * @param select_like 同时点赞
     * @returns 如果已经点赞则会点赞失败
     */
    async coin(multiply: 2, select_like: true, bvid?: string): Promise<boolean> {
        bvid = bvid || this.bvid;
        if (!bvid) throw "需要提供bvid";
        return Request.post(
            "https://api.bilibili.com/x/web-interface/coin/add",
            querystring.stringify({
                bvid,
                multiply,
                select_like,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.data.like});
    }

    /**
     * 收藏
     * @param add_media_ids 添加到收藏夹
     * @param del_media_ids 从收藏夹删除
     * @param bvid 
     * @returns 是否为未关注用户收藏
     */
    async deal(add_media_ids?: number[], del_media_ids?: number[], bvid?: string): Promise<boolean> {
        return Request.post(
            "https://api.bilibili.com/x/v3/fav/resource/deal",
            querystring.stringify({
                rid: bvid,
                type: 2,
                add_media_ids: add_media_ids?.join(",") ?? "",
                del_media_ids: del_media_ids?.join(",") ?? "",
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.data.prompt});
    }

    /**
     * 一键三连
     * @param bvid 
     * @returns 
     */
    async triple(bvid?: string): Promise<TripleResponse> {
        bvid = bvid || this.bvid;
        if (!bvid) throw "需要提供bvid";
        return Request.post(
            "http://api.bilibili.com/x/web-interface/archive/like/triple",
            querystring.stringify({
                bvid,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.data});
    }
}