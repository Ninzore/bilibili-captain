import { User } from "./user";
import { UserInfo } from "./types/user";
import { devIdGen, devIdVerify } from "./sign";

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
        },
    ) {
        this.cookie = { SESSDATA, bili_jct: biliJct };
        this.csfr = biliJct;
        this.uid = extra?.uid ? extra?.uid : 0;
        this.refreshToken = extra?.refreshToken ? extra?.refreshToken : "";
        this.timestamp = extra?.timestamp ? extra?.timestamp : Date.now();
        this.dedeUserIdCkMd5 = extra?.dedeUserIdCkMd5 ? extra?.dedeUserIdCkMd5 : "";
        this.valid = false;

        const tmp: String[] = [];
        for (const [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookieStr = tmp.join("; ");

        if (extra?.devId) {
            if (!devIdVerify(extra.devId)) {
                throw new Error("dev_id 不符合规范，参考https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/message/private_msg.md");
            }
        }
        else {
            this.devId = devIdGen();
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
            const user = new User(this);
            const info = await user.info(this.uid);
            this.info = info;
        }
        else {
            await this.validCredit();
            const user = new User(this);
            const info = await user.info(this.uid);
            this.info = info;
        };
        return this.info;
    }
}
