import { User } from "./user";
import { UserInfo } from "./types/user";
import { devIdGen, devIdVerify, genBuvidFp, genUuid, getFingerSpi } from "./sign";

/**
 * 保存各种凭据
 */
export class BiliCredential {
    // 参考https://github.com/SocialSisterYi/bilibili-API-collect/issues/933
    public cookies: {
        SESSDATA: string;
        bili_jct: string;
        buvid_fp: string;
        buvid3: string;
        buvid4: string;
        b_nut: string; // 时间戳
        _uuid: string;
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
     * @param extra? 可选
     */
    constructor(SESSDATA: string, biliJct: string,
        extra?: {
            uid?: number,
            refreshToken?: string,
            devId?: string,
            buvid3?: string,
            buvid4?: string,
            b_lsid?: string,
            buvid_fp?: string,
            timestamp?: number,
            dedeUserIdCkMd5?: string
        },
    ) {
        this.timestamp = extra?.timestamp ? extra?.timestamp : Date.now();
        this.cookies = {
            SESSDATA,
            bili_jct: biliJct,
            buvid_fp: "",
            buvid3: "",
            buvid4: "",
            b_nut: this.timestamp.toString(),
            _uuid: genUuid(),
        };
        this.csfr = biliJct;
        this.uid = extra?.uid ? extra?.uid : 0;
        this.refreshToken = extra?.refreshToken ? extra?.refreshToken : "";

        this.dedeUserIdCkMd5 = extra?.dedeUserIdCkMd5 ? extra?.dedeUserIdCkMd5 : "";
        this.valid = false;

        const tmp: String[] = [];
        for (const [k, v] of Object.entries(this.cookies)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookieStr = tmp.join("; ");

        if (extra?.devId) {
            if (!devIdVerify(extra.devId)) {
                throw new Error("dev_id 不符合规范，参考https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/message/private_msg.md");
            }
        }
        else this.devId = devIdGen();
    }

    async init() {
        const { b_3, b_4 } = await getFingerSpi();
        this.cookies.buvid3 = b_3;
        this.cookies.buvid4 = b_4;
        this.cookies.b_nut = this.timestamp.toString();
        this.cookies.buvid_fp = genBuvidFp("Hello from BiliBili-Captain at" + this.timestamp);

        const tmp: String[] = [];
        for (const [k, v] of Object.entries(this.cookies)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookieStr = tmp.join("; ");

        await this.validCredit();
        await this.loadInfo();
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
