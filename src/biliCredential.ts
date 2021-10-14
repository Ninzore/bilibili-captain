import {User} from "./user";
import {MyInfoResp, LiveRoom} from "./types/user"

interface Info extends MyInfoResp {
    liveroom?: LiveRoom;
};

/**
 * 保存各种凭据
 */
export class BiliCredential {
    public cookie: {
        sessdata: string;
        bili_jct: string;
    };
    public cookie_str: string;
    public csfr: string;
    public dev_id: string;
    public uid!: number;
    public info!: Info;

    /**
     * @param sessdata 必要
     * @param bili_jct 必要
     * @param dev_id device id，不传的话会自动生成
     */
    constructor(sessdata: string, bili_jct: string, dev_id?: string) {
        this.cookie = {sessdata, bili_jct};
        this.csfr = bili_jct;

        let tmp = [];
        for (let [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookie_str = tmp.join("; ");

        if (dev_id 
            && !/[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}/.test(dev_id)
        ) throw "dev_id 不符合规范，参考https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/message/private_msg.md"; 
        this.dev_id = dev_id ? dev_id
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (name => {
            let randomInt = 16 * Math.random() | 0;
            return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
        }));
        
        User.myInfo(this).then(res => {
            this.uid = res.mid;
            this.info = res;

            User.info(this.uid).then(res => {
                this.info.liveroom = 
                res.live_room.roomStatus === 0 ? undefined : res.live_room;
            }).catch(() => {
                console.error("自动获取直播间id失败");
                this.info.liveroom = undefined;
            });
        }).catch(() => {
            console.error("自动获取mid失败");
            this.uid = 0;
        });
    }
}