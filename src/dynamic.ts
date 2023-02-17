import { ReadStream } from "fs-extra";
import { BiliCredential } from "./biliCredential";
import { BiliCaptainError } from "./error";
import {
    CreateDraftResponse, CreateResponse, DynamiDetail,
    GetDraftsResponse, PreJudgeResp, PublishDraftResponse, RepostResponse,
    RmDraftResponse,
} from "./types/dynamic";
import { Request } from "./request";
import { Common } from "./common";

/**
 * 动态
 */
export class Dynamic {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 获取动态内容
     * @param dynamicId 动态id
     * @returns
     */
    static async detail(dynamicId: string): Promise<DynamiDetail> {
        return Request.get(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail",
            { dynamic_id: dynamicId },
        ).then(res => res.data);
    }

    /**
     * 发送动态
     * @param text 动态文字
     * @param images 动态图片
     * @param publishTime 发布时间
     * @returns
     */
    async create(text: string, images?: (string | Buffer | ReadStream)[]): Promise<CreateResponse>;
    async create(text: string, images: [], publishTime: Date): Promise<CreateDraftResponse>;
    async create(text: string, images: (string | Buffer | ReadStream)[], publishTime: Date): Promise<CreateDraftResponse>;
    async create(text: string, images?: (string | Buffer | ReadStream)[], publishTime?: Date): Promise<CreateResponse | CreateDraftResponse> {
        if (publishTime) return this.schduledCreate(publishTime, text, images);
        return images ? Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create_draw",
            {
                ...await this._dynamicRequest(text, images),
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data) : Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create",
            {
                ...await this._dynamicRequest(text),
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 发送定时动态
     * @param publishTime 发布时间
     * @param text 动态文字
     * @param images 动态图片
     * @returns
     */
    async schduledCreate(publishTime: Date, text: string, images?: (string | Buffer | ReadStream)[]): Promise<CreateDraftResponse> {
        if (new Date() > publishTime) throw new BiliCaptainError("定时发布时间必须大于当前时间");
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_draft/v1/dynamic_draft/add_draft",
            {
                type: images ? 2 : 4,
                request: JSON.stringify(await this._dynamicRequest(text, images)),
                publish_time: publishTime.getTime() / 1000 >> 0,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data);
    }

    private async _dynamicRequest(text: string, images?: (string | Buffer | ReadStream)[]): Promise<Object> {
        let atUids: string[] = [];
        let ctrl: object[] = [];
        if (text.indexOf("@") !== -1) ({ at_uids: atUids, ctrl } = await Common.parseAt(text));
        const atUidsStr = JSON.stringify(atUids);
        const ctrlStr = JSON.stringify(ctrl);

        if (images) {
            const pictures = [];

            for (const img of images) {
                const res = await Common.uploadBfs(img, this.credential);
                pictures.push({
                    img_src: res.image_url,
                    img_width: res.image_width,
                    img_height: res.image_height,
                });
            }
            return {
                biz: 3,
                category: 3,
                type: 0,
                pictures: JSON.stringify(pictures),
                title: "",
                tags: "",
                description: text,
                content: text,
                setting: '{"copy_forbidden":0,"cachedTime":0}',
                from: "create.dynamic.web",
                up_choose_comment: 0,
                up_close_comment: 0,
                extension: '{"emoji_type":1,"from":{"emoji_type":1},"flag_cfg":{}}',
                at_uids: atUidsStr,
                at_control: ctrlStr,
            };
        }
        return {
            dynamic_id: 0,
            type: 4,
            rid: 0,
            content: text,
            extension: '{"emoji_type":1,"from":{"emoji_type":1},"flag_cfg":{}}',
            at_uids: atUidsStr,
            ctrl: ctrlStr,
            up_choose_comment: 0,
            up_close_comment: 0,
        };
    }

    /**
     * 发起投票（开发中不要动）
     * @param title 标题
     * @param options 选项
     * @param opt_images 图片选项
     * @param choice_cnt 最多选择几项
     * @param desc 简介说明
     * @param duration 时长，3天|1周|一个月
     * @returns
     */
    async createVote(title: string, options: string[],
        optImages: (string | Buffer | ReadStream)[] = [],
        choiceCnt = 1, desc = "", duration: 259200 | 604800 | 2592000 = 259200): Promise<string> {
        if (options.length < 2) throw new BiliCaptainError("最少需要2个选项");
        else if (options.length > 20) throw new BiliCaptainError("最多只能有20个选项");
        else if (choiceCnt > options.length) throw new BiliCaptainError("可选数量必须比选项少");

        const newOpts: { desc: string, img_url?: string }[] = [];
        if (optImages.length > 0) {
            if (options.length !== optImages.length) throw new BiliCaptainError("选项和选项配图数量不一致");
            for (const i in options) {
                if (options[i].length < 1) throw new BiliCaptainError("选项的长度必须大于0");
                const res = await Common.uploadBfs(optImages[i], this.credential);
                newOpts[i].img_url = res.image_url;
                newOpts[i].desc = desc;
            }
        }
        else {
            for (const desc of options) {
                if (desc.length < 1) throw new BiliCaptainError("选项的长度必须大于0");
                newOpts.push({ desc });
            }
        }

        return Request.post(
            "https://api.vc.bilibili.com/vote_svr/v1/vote_svr/create_vote",
            {
                info: {
                    title,
                    desc,
                    type: 0,
                    choice_cnt: choiceCnt,
                    duration,
                    options: newOpts,
                },
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data.vote_id);
    }

    /**
     * 删除动态
     * @param dynamicId 动态id
     * @returns
     */
    async remove(dynamicId: string): Promise<boolean> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
            {
                dynamic_id: dynamicId,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.code === 0);
    }

    /**
     * 获取尚未发布的定时动态列表
     * @returns
     */
    async getDrafts(): Promise<GetDraftsResponse[]> {
        return Request.get(
            "https://api.vc.bilibili.com/dynamic_draft/v1/dynamic_draft/get_drafts",
            {},
            this.credential,
        ).then(res => res.data.drafts);
    }

    /**
     * 立即发布定时动态
     * @param draftId
     */
    async publishDraft(draftId: string): Promise<PublishDraftResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_draft/v1/dynamic_draft/publish_now",
            {
                draft_id: draftId,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        );
    }

    /**
     * 删除定时动态
     * @param draftId 草稿id
     * @returns
     */
    async rmDraft(draftId: string): Promise<RmDraftResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_draft/v1/dynamic_draft/rm_draft",
            {
                draft_id: draftId,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 检查是否能够发布动态，在发布后调用
     * @param selfuid 自己的uid，不填的话会自动调用BiliCredential中的uid
     * @returns
     */
    async preJudge(selfuid?: number): Promise<PreJudgeResp> {
        if (!selfuid && !this.credential.uid) throw new BiliCaptainError("需要提供自己的uid");
        return Request.get(
            "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/pre_judge",
            { uid: selfuid || this.credential.uid },
            this.credential,
        ).then(res => res.data);
    }

    /**
     * 转发动态
     * @param dynamicId 动态id
     * @param text 转发文字
     * @returns
     */
    async repost(dynamicId: string, text = "转发动态"): Promise<RepostResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost",
            {
                dynamic_id: dynamicId,
                content: text,
                extension: '{"emoji_type":1}',
                at_uids: "",
                ctrl: [],
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        );
    }

    /**
     * 点赞动态
     * @param dynamicId 动态id
     * @param action 点赞或取消点赞
     * @returns
     */
    async like(dynamicId: string, action: boolean): Promise<boolean> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb",
            {
                dynamic_id: dynamicId,
                up: action ? 1 : 2,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        ).then(res => res.code === 0);
    }

    /**
     * 分享到动态
     * @param rid 视频=av，专栏=cv，音频=au，番剧=eq
     * @param content 来说说分享的理由？|´・ω・)ノ
     * @param type 视频=8，专栏=64，音频=256，自定义=2048，番剧=4097
     * @param uid up主uid（可以为0）
     * @returns
     */
    async share(rid: string, content: string, type: 8 | 64 | 256 | 2048 | 4097, uid: string = "0"): Promise<CreateResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/share",
            {
                rid,
                type,
                content,
                uid,
                csrf_token: this.credential.csfr,
            },
            this.credential,
        );
    }
}
