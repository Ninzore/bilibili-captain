import {Request} from "./Request";
import {UserInfo, UserInfoFromSearch} from "./types/User";

export class User {

    /**
     * 查看用户信息
     * @param mid 用户id
     * @returns 
     */
    static async info(mid: number): Promise<UserInfo> {
        return await Request.get("https://api.bilibili.com/x/space/acc/info", {mid});
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
                "keyword": keyword,
                "build" : 63800200,  // 实测其实写啥都可以...但是得有
                "order" : "fans",
                "type" : 2,
            }
        ).then(res => {
            return 'items' in res.data ? res.data.items : [];
        });
     }
}