import {BiliCredential} from "./BiliCredential";
import {Request} from "./Request";
import { PageListReturn, VideoDetail } from "./types/Video";

export class Video {
    private credential: BiliCredential;
    
    constructor(credential: BiliCredential) {
        this.credential = credential;
    }
    
    /**
     * 获取视频详细信息
     * @param bvid 
     * @returns 
     */
    async detail(bvid: string): Promise<VideoDetail> {
        return Request.get(
            "http://api.bilibili.com/x/web-interface/view",
            {bvid},
            this.credential
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
}