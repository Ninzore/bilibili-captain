import {User} from "./user";
import {MyInfoResp, LiveRoom} from "./types/user";

interface Info extends MyInfoResp {
    liveroom?: LiveRoom;
};

/**
 * 保存各种凭据
 */
export class BiliCredential {
    public cookie: {
        SESSDATA: string;
        bili_jct: string;
    };
    public cookie_str: string;
    public csfr: string;
    public uid: number;
    public dev_id!: string;
    public refreshToken!: string;
    public timestamp: number;
    public dedeUserID__ckMd5: string;
    public info!: Info;
    public valid: Boolean;

    /**
     * @param SESSDATA 必要
     * @param bili_jct 必要
     * @param extra uid: 用户uid; dev_id: device id，不传的话会自动生成
     */
    constructor(SESSDATA: string, bili_jct: string,
        extra?: {uid?: number, refreshToken?: string,
        dev_id?: string, timestamp?: number, dedeUserID__ckMd5?: string}) {
        this.cookie = {SESSDATA, bili_jct};
        this.csfr = bili_jct;
        this.uid = extra?.uid ? extra?.uid : 0;
        this.refreshToken = extra?.refreshToken ? extra?.refreshToken : "";
        this.timestamp = extra?.timestamp ? extra?.timestamp : Date.now();
        this.dedeUserID__ckMd5 = extra?.dedeUserID__ckMd5 ? extra?.dedeUserID__ckMd5 : "";
        this.valid = false;

        let tmp = [];
        for (let [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookie_str = tmp.join("; ");

        if (extra?.dev_id) {
            if (!/[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[\dA-F]{4}-[\dA-F]{12}/.test(extra?.dev_id)) {
                throw "dev_id 不符合规范，参考https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/message/private_msg.md";
            }
        }
        else {
            this.dev_id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (name => {
                let randomInt = 16 * Math.random() | 0;
                return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
            }));
        }
    }

    validCredit() {
        User.myInfo(this).then(res => {
            console.log("info collected");
            if (!this.uid) this.uid = res.mid;
            this.info = res;
            this.valid = true;

            User.info(this.uid).then(res => {
                this.info.liveroom = res.live_room.roomStatus === 0 
                ? undefined : res.live_room;
            }).catch(() => {
                console.error("自动获取直播间id失败");
                this.info.liveroom = undefined;
            });
            return true;
        }).catch((err) => {
            console.error("登录失效", err);
            this.uid = 0;
            this.valid = false;
            return false;
        });
    }
}
