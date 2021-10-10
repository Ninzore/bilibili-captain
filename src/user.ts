import {BiliCredential} from "./biliCredential";
import {Request} from "./request";
import {UserInfo, MyInfoResp, UserInfoFromSearch, BatchUserInfosResp} from "./types/user";

/**
 * 用户
 */
export class User {
    private credential: BiliCredential;

    constructor(credential: BiliCredential, public uid?: number) {
        this.credential = credential;
        
        if (!uid && !this.credential.uid) this.myInfo().then(res => {
            this.uid = res.mid;
        }).catch(() => {
            console.error("自动获取mid失败");
            uid = undefined;
        });
    }

    /**
     * 查看用户信息
     * @param mid 用户id
     * @returns 
     */
    static async info(mid: number): Promise<UserInfo> {
        return Request.get(
            "https://api.bilibili.com/x/space/acc/info", 
            {mid}
        ).then(res => {return res.data;});
    }

    /**
     * 批量查看用户信息
     * @param mid 用户id
     * @returns 
     */
    static async batchInfos(uids: number[]): Promise<BatchUserInfosResp[]> {
        return Request.get(
            "https://api.vc.bilibili.com/account/v1/user/infos", 
            {uids: uids.join(",")}
        ).then(res => {return res.data;});
    }

    /**
     * 获取自己的信息
     * @returns 
     */
    static async myInfo(credential: BiliCredential): Promise<MyInfoResp> {
        return Request.get(
            "https://api.bilibili.com/x/space/myinfo",
            {}, credential
        ).then(res => {return res.data});
    }
    async myInfo(): Promise<MyInfoResp> {
        return User.myInfo(this.credential);
    }

    /**
     * 用于检查用户id或搜索用户是否存在
     * @param keyword 搜索关键字 / 用户id
     * @returns 返回用户mid，如果不存在则返回0
     */
    static async exist(keyword: string | number): Promise<0 | number> {
        const checkInfo = async (keyword: number) => {
            return this.info(keyword)
            .then(res => {return res.mid})
            .catch(() => {return 0});
        }

        if (typeof keyword == "number") return checkInfo(keyword);
        else {
            if (/^\d+$/.test(keyword)) return checkInfo(parseInt(keyword));
            else {
                const res = await this.searchUser(keyword);
                return res.length > 0 ? res[0].mid : 0;
            }
        }
    }
    
    /**
     * 根据关键字搜索用户
     * @param keyword 搜索关键字
     * @returns 
     */
    static async searchUser(keyword: string): Promise<UserInfoFromSearch[]> {
        return Request.get(
            "https://app.bilibili.com/x/v2/search/type",
            {
                keyword,
                build : 63800200,  // 实测其实写啥都可以...但是得有
                order : "fans",
                type : 2,
            }
        ).then(res => {
            return 'items' in res.data ? res.data.items : [];
        });
    }

    /**
     * 操作和用户的关系
     * @param act 操作码 
     * 关注=1，取关=2，悄悄关注=3，取消悄悄关注=4，拉黑=5，取消拉黑=6，去除粉丝=7
     * @param re_src 来源 空间：11，视频：14，文章：115，活动页面：222
     * @param uid 用户uid
     * @returns 
     */
    private async _modifyRelation(act: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1, re_src: 11 | 14 | 115 | 222 = 11, uid?: number): Promise<boolean> {
        uid = uid ?? this.uid;
        if (!uid) throw "需要用户uid";

        return Request.get(
            "https://api.bilibili.com/x/relation/modify",
            {
                fid: uid,
                act: act ? 1 : 2,
                re_src,
                csrf: this.credential.csfr
            }
        ).then(res => {return res.code === 0});
    }

    /**
     * 关注/取关用户
     * @param act 操作码，关注=1，取关=2，悄悄关注=3，取消悄悄关注=4
     * @param re_src 来源， 空间：11，视频：14，文章：115，活动页面：222
     * @param uid 用户uid
     * @returns 
     */
    async follow(act: 1 | 2 | 3 | 4 = 1, re_src: 11 | 14 | 115 | 222 = 11, uid?: number): Promise<boolean> {
        return this._modifyRelation(act, re_src, uid);
    }

    /**
     * 加入，取消黑名单
     * @param act 操作码，加入黑名单=5，取消黑名单=6
     * @param re_src 来源， 空间：11，视频：14，文章：115，活动页面：222
     * @param uid 用户uid
     * @returns 
     */
    async block(act: 5 | 6 = 5, re_src: 11 | 14 | 115 | 222 = 11, uid?: number): Promise<boolean> {
        return this._modifyRelation(act, re_src, uid);
    }

    /**
     * 删除粉丝
     * @param re_src 来源， 空间：11，视频：14，文章：115，活动页面：222
     * @param uid 用户uid
     * @returns 
     */
     async rmFan(re_src: 11 | 14 | 115 | 222 = 11, uid?: number): Promise<boolean> {
        return this._modifyRelation(7, re_src, uid);
    }
}