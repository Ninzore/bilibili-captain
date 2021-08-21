import querystring from "querystring";
import {BiliCredential} from "./BiliCredential";
import {Request} from "./Request";
import {Ctype, SortBy, ListResponse, CommonResponse} from "./types/Reply";

export class Comment {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 列出评论
     * @param oid 评论区id
     * @param type 评论区类型
     * @param page_num 评论区页数
     * @returns 
     */
     async list(oid: number, type: Ctype, page_num = 0, sort = SortBy.like): Promise<ListResponse> {
        return Request.get(
            "https://api.bilibili.com/x/v2/reply",
            {
                pn: page_num,
                type: type,
                oid: oid,
                sort: sort
            },
            this.credential
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 点赞评论、回复
     * @param oid 评论区类型
     * @param action 操作
     * @param type 	评论区类型
     * @returns 
     */
     async thumb(oid: number, rpid: string, type: Ctype, action = true): Promise<CommonResponse> {
        return Request.get(
            "https://api.bilibili.com/x/v2/reply/action",
            {
                oid,
                type,
                rpid,
                action: action ? 1 : 0,
                ordering: "heat",
                jsonp: "jsonp",
            },
            this.credential
        );
    }

    /**
     * 踩评论、回复
     * @param oid 评论区类型
     * @param action 操作
     * @param type 评论区类型
     * @returns 
     */
    async hate(oid: number, rpid: string, type: Ctype, action = true): Promise<CommonResponse> {
        return Request.get(
            "http://api.bilibili.com/x/v2/reply/hate",
            {
                oid,
                type,
                rpid,
                action: action ? 1 : 0,
                ordering: "heat",
                jsonp: "jsonp",
            },
            this.credential
        );
    }
}