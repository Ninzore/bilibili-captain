import { User } from "./user";
import { UserInfo } from "./types/user";

/**
 * 保存各种凭据
 */
export class BiliCredential {
    public cookie: {
        SESSDATA: string;
        bili_jct: string;
    };

    public cookieStr: string;
    public csfr: string;
    public uid: number;
    public devId!: string;
    public refreshToken!: string;
    public timestamp: number;
    public dedeUserIdCkMd5: string;
    public info!: UserInfo;
    public valid: Boolean;

    /**
     * @param SESSDATA 必要
     * @param biliJct 必要
     * @param extra uid: 用户uid; dev_id: device id，不传的话会自动生成
     */
    constructor(SESSDATA: string, biliJct: string,
        extra?: {
            uid?: number, refreshToken?: string,
            devId?: string, timestamp?: number, dedeUserIdCkMd5?: string
        }) {
        this.cookie = { SESSDATA, bili_jct: biliJct };
        this.csfr = biliJct;
        this.uid = extra?.uid ? extra?.uid : 0;
        this.refreshToken = extra?.refreshToken ? extra?.refreshToken : "";
        this.timestamp = extra?.timestamp ? extra?.timestamp : Date.now();
        this.dedeUserIdCkMd5 = extra?.dedeUserIdCkMd5 ? extra?.dedeUserIdCkMd5 : "";
        this.valid = false;

        const tmp = [];
        for (const [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookieStr = tmp.join("; ");

        if (extra?.devId) {
            if (!/[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[\dA-F]{4}-[\dA-F]{12}/.test(extra?.devId)) {
                throw new BiliCaptainError("dev_id 不符合规范，参考https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/message/private_msg.md");
            }
        }
        else {
            this.devId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, name => {
                const randomInt = 16 * Math.random() | 0;
                return (name === "x" ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
            });
        }
    }

    async validCredit() {
        return User.myInfo(this).then(async res => {
            if (!this.uid) this.uid = res.mid;
            this.valid = true;
            return true;
        }).catch((err) => {
            console.error(this.uid, "登录失效", err);
            this.valid = false;
            return false;
        });
    }

    async loadInfo(): Promise<UserInfo> {
        if (this.uid && this.valid) {
            const info = await User.info(this.uid);
            this.info = info;
        }
        else {
            await this.validCredit();
            const info = await User.info(this.uid);
            this.info = info;
        };
        return this.info;
    }
}
