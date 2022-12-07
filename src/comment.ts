import { BiliCredential } from "./biliCredential";
import { Request } from "./request";
import { Btype } from "./types/common";
import { AddResponse, CommonResponse, ListResponse, SortBy } from "./types/comment";

/**
 * 评论区
 */
export class Comment {
    private credential: BiliCredential;

    constructor(credential: BiliCredential, public oid?: string, public type?: Btype) {
        this.credential = credential;
    }

    /**
     * 发送评论
     * @param oid 评论区id
     * @param message 回复内容
     * @param type 评论区类型
     * @returns
     */
    async add(message: string, oid?: string, type?: Btype): Promise<AddResponse> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

        const payload = {
            oid,
            message,
            type,
            plat: 1,
            ordering: "heat",
            jsonp: "jsonp",
            csrf: this.credential.csfr,
        };

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/add",
            payload,
            this.credential,
        ).then(res => {
            return res;
        });
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
    async reply(root: number, parent: number, message: string, oid?: string, type?: Btype): Promise<AddResponse> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

        const payload = {
            oid,
            message,
            type,
            root,
            parent,
            plat: 1,
            ordering: "heat",
            jsonp: "jsonp",
            csrf: this.credential.csfr,
        };

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/add",
            payload,
            this.credential,
        ).then(res => {
            return res;
        });
    }

    /**
     * 删除一条回复
     * @param oid 评论区id
     * @param replyId 回复id
     * @param type 评论区类型
     * @returns
     */
    async delete(replyId: string, oid?: string, type?: Btype): Promise<CommonResponse> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/del",
            {
                oid,
                rpid: replyId,
                type,
                jsonp: "jsonp",
                csrf: this.credential.csfr,
            },
            this.credential,
        );
    }

    /**
     * 置顶一条回复
     * @param oid 评论区id
     * @param replyId 回复id
     * @param type 评论区类型
     * @returns
     */
    async top(replyId: string, action: true, oid?: string, type?: Btype): Promise<CommonResponse> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

        return Request.post(
            "https://api.bilibili.com/x/v2/reply/top",
            {
                oid,
                rpid: replyId,
                type,
                action: action ? 1 : 0,
                jsonp: "jsonp",
                csrf: this.credential.csfr,
            },
            this.credential,
        );
    }

    /**
     * 列出评论区
     * @param oid 评论区id
     * @param type 评论区类型
     * @param pageNum 评论区页数
     * @returns
     */
    async list(pageNum = 0, sort = SortBy.like, oid?: string, type?: Btype): Promise<ListResponse> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

        return Request.get(
            "https://api.bilibili.com/x/v2/reply",
            {
                pn: pageNum,
                type,
                oid,
                sort,
            },
            this.credential,
        ).then(res => {
            console.log(Object.keys(res));
            return res.data.data;
        });
    }

    /**
     * 点赞评论、回复
     * @param oid 评论区类型
     * @param action 操作
     * @param type 评论区类型
     * @returns
     */
    async like(rpid: string, action = true, oid?: string, type?: Btype): Promise<boolean> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

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
            this.credential,
        ).then(res => {
            return res.code === 0;
        });
    }

    /**
     * 踩评论、回复
     * @param oid 评论区类型
     * @param action 操作
     * @param type 评论区类型
     * @returns
     */
    async hate(rpid: string, action = true, oid?: string, type?: Btype): Promise<boolean> {
        oid = oid ?? this.oid;
        type = type ?? this.type;
        if (!oid || !type) throw new Error("需要提供oid和type");

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
            this.credential,
        ).then(res => {
            return res.code === 0;
        });
    }
}
