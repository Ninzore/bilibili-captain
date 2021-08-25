import {Request} from "./Request";
import {UserInfo} from "./types/User";

export class User {

    /**
     * 查看用户信息
     * @param mid 用户id
     * @returns 
     */
    static async info(mid: string): Promise<UserInfo> {
        return await Request.get("https://api.bilibili.com/x/space/acc/info", {mid});
    }

    /**
     * 用于检查用户是否存在
     * @param mid 用户id
     * @returns 
     */
     static async exist(mid: string): Promise<boolean> {
        return await this.info(mid)
            .then(() => {return true})
            .catch(() => {return false});
     }
}