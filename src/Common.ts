import axios from "axios";
import {User} from "./User";
import {Dynamic} from "./Dynamic";
import {Request} from "./Request";
import {ParseAt, DynamicCtrl, ResInfo, Btype} from "./types/Common";


interface Obj {
    [key: string]: number;
}

const PATH2BTYPE: Obj = {
    video: 1,
    read: 2
}

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

    static async expandShortUrl(shortUrl: string): Promise<string> {
        return axios.head(shortUrl, {
            headers : {
                "Accept" : "application/json",
                "Host" : "b23.tv",
                "user-agent": Request.user_agent
            }
        }).then(async res => {
            const destination: string = res.request.host 
            + res.request.path.substring(0, res.request.path.indexOf("?"));
            return destination;
        });
    }

    static async resInfo(url: string): Promise<ResInfo> {
        let info = {
            oid: "",
            btype: 1 as Btype
        }
        if (/^\d{18}/.exec(url)) {
            const dynamic_id = /\d{18}/.exec(url);
            if (!dynamic_id) return info;
            info.oid = dynamic_id[0];
            const dynamic = await Dynamic.detail(dynamic_id[0]);
            info.btype = dynamic.data.card.desc.r_type == 1 ? 17 : 11;
        }
        else {
            const oid = url.substring(6, url.length);
            info.oid = oid;
            const path = /\w+\//.exec(url);
            info.btype = path ? PATH2BTYPE[path[0]] as Btype : 1;
        }
        return info;
    }
}