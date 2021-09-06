import * as fs from "fs-extra";
import * as FormData from "form-data";
import * as querystring from "query-string";
import { ReadStream } from "fs-extra"
import {BiliCredential} from "./BiliCredential";
import {UploadBfsResponse, CreateResponse, RepostResponse, DynamiDetail} from "./types/Dynamic";
import {Request} from "./Request";
import {Common} from "./Common";

export class Dynamic {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 
     * @param dynamic_id 动态id
     * @returns 
     */
     static async detail(dynamic_id: string): Promise<DynamiDetail> {
        return Request.get(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail",
            {dynamic_id}
        );
    }

    /**
     * 上传文件
     * @param file 上传文件
     * @returns 
     */
    async uploadBfs(file: string | Buffer | ReadStream): Promise<UploadBfsResponse> {
        let form = new FormData();
        form.append("biz", "dyn");
        form.append("category", "daily");
        form.append("csrf", this.credential.csfr);
        if (typeof file == "string") file = fs.createReadStream(file);
        form.append("file_up", file);

        return Request.post(
            "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs",
            form,
            this.credential
        ).then(res => {
            if (res.code == 0) console.log("image has been uploaded");
            else throw "image upload failed";
            return res;
        });
    }
    
    /**
     * 发送动态
     * @param text 动态文字
     * @param images 动态图片
     * @returns 
     */
    async create(text: string, images?: Array<string | Buffer | ReadStream>): Promise<CreateResponse> {
        let at_uids: string[] = [];
        let ctrl: object[] = [];
        if (text.indexOf("@") != -1) ({at_uids, ctrl} = await Common.parseAt(text));
        let at_uids_str = JSON.stringify(at_uids);
        let ctrl_str = JSON.stringify(ctrl);

        if (images) {
            let pictures = [];

            for (let img of images) {
                let res =  await this.uploadBfs(img);
                pictures.push({
                    img_src: res.data.image_url,
                    img_width: res.data.image_width,
                    img_height: res.data.image_height
                });
            }
            
            return Request.post(
                "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create_draw",
                querystring.stringify({
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
                    at_uids: at_uids_str,
                    at_control: ctrl_str,
                    csrf: this.credential.csfr,
                    csrf_token: this.credential.csfr
                }),
                this.credential
            );
        }
        else return Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create",
            querystring.stringify({
                dynamic_id: 0,
                type: 4,
                rid: 0,
                content: text,
                extension: '{"emoji_type":1,"from":{"emoji_type":1},"flag_cfg":{}}',
                at_uids: at_uids_str,
                ctrl: ctrl_str,
                up_choose_comment: 0,
                up_close_comment: 0,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        );
    }

    /**
     * 删除动态
     * @param dynamic_id 动态id
     * @returns 
     */
    async remove(dynamic_id: string): Promise<number> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
            querystring.stringify({
                dynamic_id: dynamic_id,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        );
    }

    /**
     * 转发动态
     * @param dynamic_id 动态id
     * @param text 转发文字
     * @returns 
     */
    async repost(dynamic_id: string, text = "转发动态"): Promise<RepostResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost",
            querystring.stringify({
                dynamic_id: dynamic_id,
                content: text,
                extension: '{"emoji_type":1}',
                at_uids: "",
                ctrl: [],
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        );
    }

    /**
     * 点赞动态
     * @param dynamic_id 动态id
     * @param action 点赞或取消点赞
     * @returns 
     */
    async thumb(dynamic_id: string, action: boolean): Promise<number> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb",
            querystring.stringify({
                dynamic_id: dynamic_id,
                up: action ? 1 : 2,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        );
    }

    /**
     * 分享到动态
     * @param rid 视频=av，专栏=cv，音频=au，番剧=eq
     * @param content 来说说分享的理由？|´・ω・)ノ
     * @param type 视频=8，专栏=64，音频=256，自定义=2048，番剧=4097
     * @param up_uid up主uid（可以为0）
     * @returns 
     */
    async share(rid: string, content: string, type: 8 | 64 | 256 | 2048 | 4097, up_uid: string = "0"): Promise<CreateResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/share",
            querystring.stringify({
                rid,
                type,
                content,
                uid: up_uid,
                csrf_token: this.credential.csfr,
            }),
            this.credential
        );
    }
}