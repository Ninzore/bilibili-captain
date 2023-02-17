import fs from "fs-extra";
import { BiliCredential } from "./biliCredential";
import { Request } from "./request";
import { Common } from "./common";
import { BiliCaptainError } from "./error";
import {
    LikeResp, MessageFromResp,
    MsgBoxResp, ReplyMsgResp, SendMsgResp, SysMsgResp,
    UnreadMsgFeedResp, UnreadPrivateMsgCountResp,
} from "./types/message";

/**
 * 收件箱
 */
export class Message {
    private credential;

    constructor(credential: BiliCredential) {
        this.credential = credential;
    }

    /**
     * 获取未读消息数量
     * @returns
     */
    async unreadMsgFeed(): Promise<UnreadMsgFeedResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/unread",
            {
                build: 0,
                mobi_app: "web",
            }, this.credential,
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 获取未读私信数量
     * @returns
     */
    async unreadPrivateMsgCount(): Promise<UnreadPrivateMsgCountResp> {
        return Request.get(
            "https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread",
            {
                unread_type: 0,
                build: 0,
                mobi_app: "web",
            },
            this.credential,
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 回复我的
     * @returns
     */
    async replys(): Promise<ReplyMsgResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/reply",
            {
                platform: "web",
                build: 0,
                mobi_app: "web",
            },
            this.credential,
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 收到的赞
     * @returns
     */
    async likes(): Promise<LikeResp> {
        return Request.get(
            "https://api.bilibili.com/x/msgfeed/like",
            {
                platform: "web",
                build: 0,
                mobi_app: "web",
            },
            this.credential,
        ).then(res => {
            return res.data;
        });
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
                mobi_app: "web",
            },
            this.credential,
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 获取私信列表
     * @param end_ts 起始时间戳，以微秒ms计
     * @session_type 消息类型，平时为1，3和5是什么为未知
     * @returns
     */
    async messageBox(endTs?: string, sessionType?: 1 | 3 | 5): Promise<MsgBoxResp> {
        if (sessionType) sessionType = 1;
        const params = {
            end_ts: endTs,
            session_type: sessionType,
            group_fold: 1,
            unfollow_fold: 0,
            sort_rule: 2,
            build: 0,
            mobi_app: "web",
        };
        if (!endTs) delete params.end_ts;

        return Request.get(
            "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
            params,
            this.credential,
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 标记已读某人消息
     * @param talkerId 发信人uid
     * @returns
     */
    async updateAck(talkerId: number): Promise<boolean> {
        return Request.post(
            "https://api.vc.bilibili.com/session_svr/v1/session_svr/update_ack",
            {
                talker_id: talkerId,
                session_type: 1,
                ack_seqno: 6,
                build: 0,
                mobi_app: "web",
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr,
            },
            this.credential,
        ).then(res => {
            return res.msg === "0";
        });
    }

    /**
     * 获取来自某人的消息
     * @param talkerId 发信人uid
     * @param size 获取数量
     * @param beginSeqno 从第几条开始
     * @param sessionType 消息类型
     * @returns
     */
    async messageFrom(talkerId: number, size = 20, beginSeqno = 0, sessionType = 1): Promise<MessageFromResp> {
        return Request.get(
            "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
            {
                sender_device_id: 1,
                talker_id: talkerId,
                session_type: sessionType,
                size,
                beginSeqno,
                build: 0,
                mobi_app: "web",
            },
        ).then(res => {
            return res.data;
        });
    }

    /**
     * 发送私信
     * @param receiverId 收件人uid
     * @param content 私信内容，发送图片时需要序列化
     * @param msgType 根据内容而定，文本=1，图片=2，撤回=5
     * @returns
     */
    async sendMsg(receiverId: number, content: string | Buffer | fs.ReadStream, msgType: 1 | 2 | 5 = 1): Promise<any> {
        if (!this.credential.uid) throw new BiliCaptainError("需要在BiliCredential中提供uid");

        switch (msgType) {
            case 1: {
                if (typeof content !== "string") throw new BiliCaptainError("msgType 为1时候 content 应为 string");
                content = JSON.stringify({ content });
                break;
            }
            case 2: {
                const uploaded = await Common.uploadBfs(content, this.credential);
                const ready = {
                    url: uploaded.image_url,
                    height: uploaded.image_height,
                    width: uploaded.image_width,
                };
                content = JSON.stringify(ready);
                break;
            }
            case 5: {
                if (typeof content !== "string"
                    || !/^\d{19}$/.test(content)) throw new BiliCaptainError("撤回消息的 msgKey 应该为一个19位数");
                break;
            }
            default: throw new BiliCaptainError("msg_type错误");
        }

        return Request.post(
            "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg",
            {
                msg: {
                    sender_uid: this.credential.uid,
                    receiver_id: receiverId,
                    receiver_type: 1,
                    msg_type: msgType,
                    msg_status: 0,
                    content,
                    dev_id: this.credential.devId,
                    timestamp: ~~(Date.now() / 1000),
                },
                csrf_token: this.credential.csfr,
                csrf: this.credential.csfr,
            },
            this.credential,
        )
            .then(res => {
                return res.data;
            })
            .catch(err => {
                if (err.code === 21041) {
                    console.warn("消息已超期，不能撤回了哦");
                    return err;
                }
                else throw err;
            });
    }

    /**
     * 撤回私信
     * @param receiver_id 收件人uid
     * @param msgKey 私信消息id
     * @returns
     */
    async withdrawMsg(receiverId: number, msgKey: string): Promise<SendMsgResp> {
        return this.sendMsg(receiverId, msgKey, 5);
    }
}
