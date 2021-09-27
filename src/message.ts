import * as qs from "qs";
import {BiliCredential} from "./biliCredential";
import {Request} from "./request";
import {UnreadMsgCountResp, UnreadPrivateMsgCountResp, 
    ReplyMsgResp, LikeResp, SysMsgResp, MsgBoxResp,
    MessageFromResp} from "./types/message";

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
}