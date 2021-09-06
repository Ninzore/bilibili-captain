import * as querystring from "query-string";
import {BiliCredential} from "./BiliCredential";
import {Request} from "./Request";
import {Btype} from "./types/Common";
import {AddResponse, SortBy, ListResponse, CommonResponse} from "./types/Comment";

export class Comment {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 发送评论
     * @param oid 评论区id
     * @param message 回复内容
     * @param type 评论区类型
     * @returns 
     */
    async add(oid: string, type: Btype, message: string): Promise<AddResponse> {
        let payload = {
            oid,
            message,
            type,
            plat: 1,
            ordering: "heat",
            jsonp: "jsonp",
            csrf: this.credential.csfr,
        }

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/add",
            querystring.stringify(payload),
            this.credential
        ).then(res => {return res;});
    }

    /**
     * 发送回复
     * @param oid 评论区id
     * @param type 评论区类型
     * @param root 回复串根
     * @param parent 想要回复的那条回复
     * @param message 回复内容
     * @returns 
     */
     async reply(oid: string, type: Btype, root: number, parent: number, message: string): Promise<AddResponse> {
        let payload = {
            oid,
            message,
            type,
            root,
            parent,
            plat: 1,
            ordering: "heat",
            jsonp: "jsonp",
            csrf: this.credential.csfr,
        }

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/add",
            querystring.stringify(payload),
            this.credential
        ).then(res => {return res;});
    }

    /**
     * 删除一条回复
     * @param oid 评论区id
     * @param reply_id 回复id
     * @param type 评论区类型
     * @returns 
     */
    async delete(oid: string, reply_id: string, type: Btype): Promise<CommonResponse> {
        return Request.post(
            "https://api.bilibili.com/x/v2/reply/del",
            querystring.stringify({
                oid: oid,
                rpid: reply_id,
                type: type,
                jsonp: "jsonp",
                csrf: this.credential.csfr,
            }),
            this.credential
        );
    }

    /**
     * 置顶一条回复
     * @param oid 评论区id
     * @param reply_id 回复id
     * @param type 评论区类型
     * @returns 
     */
    async top(oid: string, reply_id: string, type: Btype, action: true): Promise<CommonResponse> {
        return Request.post(
            "https://api.bilibili.com/x/v2/reply/top",
            querystring.stringify({
                oid,
                rpid: reply_id,
                type,
                action: action ? 1 : 0,
                jsonp: "jsonp",
                csrf: this.credential.csfr,
            }),
            this.credential
        );
    }

    /**
     * 列出评论区
     * @param oid 评论区id
     * @param type 评论区类型
     * @param page_num 评论区页数
     * @returns 
     */
    async list(oid: string, type: Btype, page_num = 0, sort = SortBy.like): Promise<ListResponse> {
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
            console.log(Object.keys(res))
            return res.data.data;
        });
    }

    /**
     * 点赞评论、回复
     * @param oid 评论区类型
     * @param action 操作
     * @param type 	评论区类型
     * @returns 
     */
    async thumb(oid: string, rpid: string, type: Btype, action = true): Promise<CommonResponse> {
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
    async hate(oid: string, rpid: string, type: Btype, action = true): Promise<CommonResponse> {
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