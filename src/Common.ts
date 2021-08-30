import { User } from "./User";
import {ParseAt, DynamicCtrl} from "./types/Common";

export class Common {
    /**
     * 处理at
     * @param text 文本
     * @returns 
     */
    static async parseAt(text: string): Promise<ParseAt> {
        let at_uids: string[] = [];
        let ctrl: DynamicCtrl[] = [];
        const match = text.matchAll(/@(\S+)/g);
        
        for await (let group of match) {
            if (group.index == undefined) throw "at 解析错误";
            const user = group[1];
            const mid = (await User.exist(user)).toString();
            if (!mid) throw `${user} 这名用户不存在`;
            
            at_uids.push(mid);
            ctrl.push({
                location: group.index,
                type: 1,
                length: user.length + 2,
                data: mid
            });
        }
        return {at_uids, ctrl};
    }
}