import * as qs from "qs";
import {BiliCredential} from "./biliCredential";
import {Request} from "./request";
import {UnreadMsgCountResp, UnreadPrivateMsgCountResp, 
    ReplyMsgResp, LikeResp, SysMsgResp, MsgBoxResp,
    MessageFromResp, SendMsgResp} from "./types/message";

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

    /**
     * 回复我的
     * @returns 
     */
    async replys(): Promise<ReplyMsgResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/reply",
            {
                platform:   "web",
                build: 0,
                mobi_app: "web"
            },
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 收到的赞
     * @returns 
     */
    async likes(): Promise<LikeResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/like",
            {
                platform:   "web",
                build: 0,
                mobi_app: "web"
            },
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 获取系统通知
     * @param cursor 起始位置
     * @returns 
     */
    async sysMsg(cursor?: string): Promise<SysMsgResp[]> {
        return Request.get(
            "https://message.bilibili.com/x/sys-msg/query_notify_list",
            {
                cursor,
                csrf: this.credential.csfr,
                data_type: 1,
                build: 0,
                mobi_app: "web"
            },
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 获取私信列表
     * @param end_ts 起始时间戳，以微秒ms计
     * @session_type 消息类型，平时为1，3和5是什么为未知
     * @returns 
     */
    async messageBox(end_ts?: string, session_type?: 1 | 3 | 5): Promise<MsgBoxResp> {
        if (session_type) session_type = 1;
        let params = {
            end_ts,
            session_type,
            group_fold: 1,
            unfollow_fold: 0,
            sort_rule: 2,
            build: 0,
            mobi_app: "web"
        };
        if (!end_ts) delete params.end_ts;

        return Request.get(
            "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
            params,
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 标记已读某人消息
     * @param talker_id 发信人uid
     * @returns 
     */
    async updateAck(talker_id: number): Promise<boolean> {
        return Request.post(
            "https://api.vc.bilibili.com/session_svr/v1/session_svr/update_ack",
            qs.stringify({
                talker_id,
                session_type: 1,
                ack_seqno: 6,
                build: 0,
                mobi_app: "web",
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.msg === "0"});
    }

    /**
     * 获取来自某人的消息
     * @param talker_id 发信人uid
     * @param size 获取数量
     * @param begin_seqno 从第几条开始
     * @param session_type 消息类型
     * @returns 
     */
    async messageFrom(talker_id: number, size = 20, begin_seqno = 0, session_type = 1): Promise<MessageFromResp> {
        return Request.get(
            "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
            {
                sender_device_id: 1,
                talker_id,
                session_type,
                size,
                begin_seqno,
                build: 0,
                mobi_app: "web"
            }
        ).then(res => {return res.data;});
    }

    /**
     * 发送私信
     * @param receiver_id 收件人uid
     * @param content 私信内容，发送图片时需要序列化
     * @param msg_type 根据内容而定，文本=1，图片=2，撤回=5
     * @returns 
     */
    async sendMsg(receiver_id: number, content: string, msg_type: 1 | 2 | 5 = 1): Promise<SendMsgResp> {
        if (!this.credential.uid) throw "需要在BiliCredential中提供uid"
        return Request.post(
            "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg",
            qs.stringify({
                msg: {
                    sender_uid: this.credential.uid,
                    receiver_id,
                    receiver_type: 1,
                    msg_type,
                    msg_status: 0,
                    content,
                    dev_id: this.credential.dev_id,
                    timestamp: ~~ (Date.now() / 1000)
                },
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr
            }),
            this.credential
        ).then(res => {return res.data;});
    }

    /**
     * 撤回私信
     * @param receiver_id 收件人uid
     * @param msg_key 私信消息id
     * @returns 
     */
    async withdrawMsg(receiver_id: number, msg_key: string): Promise<SendMsgResp> {
        return this.sendMsg(receiver_id, msg_key, 5);
    }
}