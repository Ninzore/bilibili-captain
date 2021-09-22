import {BiliCredential} from "./biliCredential";
import {Request} from "./request";
import {UnreadMsgCountResp, UnreadPrivateMsgCountResp, ReplyMsgResp, LikeResp} from "./types/message";

export class Message {
    private credential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 获取未读消息数量
     * @returns 
     */
     async unreadMsgCount(): Promise<UnreadMsgCountResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/unread",
            {
                build: 0,
                mobi_app: "web"
            }
        ).then(res => {return res.data;});
    }

    /**
     * 获取未读私信数量
     * @returns 
     */
    async unreadPrivateMsgCount(): Promise<UnreadPrivateMsgCountResp> {
        return Request.get(
            "http://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread",
            {
                unread_type: 0,
                build: 0,
                mobi_app: "web"
            },
            this.credential
        ).then(res => {return res.data;});
    }

    async replys(): Promise<ReplyMsgResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/reply",
            {
                platform:   "web",
                build: 0,
                mobi_app: "web"
            }
        ).then(res => {return res.data;});
    }

    async likes(): Promise<LikeResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/like",
            {
                platform:   "web",
                build: 0,
                mobi_app: "web"
            }
        ).then(res => {return res.data;});
    }
}