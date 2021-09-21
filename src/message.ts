import {BiliCredential} from "./BiliCredential";
import {Request} from "./Request";
import {UnreadMsgCountResp, UnreadPrivateMsgCountResp} from "./types/message";

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
        )
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
        );
    }
}