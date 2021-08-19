import fs, { ReadStream } from "fs-extra";
import FormData from "form-data";
import querystring from "querystring";
import {BiliCredential} from "./BiliCredential";
import {UploadBfsResponse, CreateResponse, RemoveResponse} from "./types/Dynamic";
import {Request} from "./Request";

export class Dynamic {
    private credential: BiliCredential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 
     * @param category 
     * @param file 
     * @returns 
     */
    async uploadBfs(file: Buffer | ReadStream): Promise<UploadBfsResponse> {
        let form = new FormData();
        form.append("biz", "dyn");
        form.append("file_up", file);
        form.append("csrf", this.credential.csfr);
    
        return Request.post(
            "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs",
            form,
            this.credential
        ).then(res => {
            if (res.code == 0) console.log("image has been uploaded");
            else console.error("image upload failed");
            return res;
        });
    }
    
    async create(text: string, images?: Array<string | Buffer | ReadStream>): Promise<CreateResponse> {
        if (images) {
            let pictures = [];

            for (let img of images) {
                if (typeof img == "string") img = fs.createReadStream(img);
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
                    at_uids: "",
                    at_control: '[]',
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
                at_uids: "",
                ctrl: [],
                up_choose_comment: 0,
                up_close_comment: 0,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        );
    }

    async remove(dynamic_id: string): Promise<RemoveResponse> {
        return Request.post(
            "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
            querystring.stringify({
                dynamic_id: dynamic_id,
                csrf: this.credential.csfr,
                csrf_token: this.credential.csfr
            }),
            this.credential
        )
    }
}