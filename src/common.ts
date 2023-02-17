import axios from "axios";
import * as fs from "fs-extra";
import * as FormData from "form-data";
import { User } from "./user";
import { readFile } from "./utils";
import { Dynamic } from "./dynamic";
import { Request } from "./request";
import { BiliCredential } from "./biliCredential";
import { Btype, DynamicCtrl, ParseAt, ResInfo, UploadBfsResp } from "./types/common";
import { BiliCaptainError } from "./error";
interface Obj {
    [key: string]: number;
}

const PATH2BTYPE: Obj = {
    video: 1,
    read: 2,
};

/**
 * 共通
 */
export class Common {
    /**
     * 处理at
     * @param text 文本
     * @returns
     */
    static async parseAt(text: string): Promise<ParseAt> {
        const atUids: string[] = [];
        const ctrl: DynamicCtrl[] = [];
        const match = text.matchAll(/@(\S+)/g);

        for await (const group of match) {
            if (group.index === undefined) throw new BiliCaptainError("at 解析错误");
            const user = group[1];
            const mid = (await User.exist(user)).toString();
            if (!mid) throw new BiliCaptainError(`${user} 这名用户不存在`);

            atUids.push(mid);
            ctrl.push({
                location: group.index,
                type: 1,
                length: user.length + 2,
                data: mid,
            });
        }
        return { at_uids: atUids, ctrl };
    }

    /**
     * 上传文件
     * @param file 上传文件
     * @returns
     */
    static async uploadBfs(file: string | Buffer | fs.ReadStream, credential: BiliCredential): Promise<UploadBfsResp> {
        if (typeof file === "string") file = await readFile(file);

        const form = new FormData();
        form.append("biz", "dyn");
        form.append("file_up", file);
        form.append("category", "daily");
        form.append("csrf", credential.csfr);

        return Request.post(
            "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs",
            form,
            credential,
        ).then(res => {
            return res.data;
        });
    }

    static async expandShortUrl(shortUrl: string): Promise<string> {
        return axios.head(shortUrl, {
            headers: {
                "Accept": "application/json",
                "Host": "b23.tv",
                "user-agent": Request.userAgent,
            },
        }).then(async res => {
            const destination: string = res.request.host
                + res.request.path.substring(0, res.request.path.indexOf("?"));
            return destination;
        });
    }

    static async resInfo(url: string): Promise<ResInfo> {
        const info = {
            oid: "",
            btype: 1 as Btype,
        };
        if (/^\d{18}/.exec(url)) {
            const dynamicId = /\d{18}/.exec(url);
            if (!dynamicId) return info;
            info.oid = dynamicId[0];
            const dynamic = await Dynamic.detail(dynamicId[0]);
            info.btype = dynamic.card.desc.r_type === 1 ? 17 : 11;
        }
        else {
            const oid = url.substring(6, url.length);
            info.oid = oid;
            const path = /\w+\//.exec(url);
            info.btype = path ? PATH2BTYPE[path[0]] as Btype : 1;
        }
        return info;
    }

    static avBvInterchange(id: string): string {
        const s = [11, 10, 3, 8, 4, 6];
        const xor = 177451812;
        const add = 8728348608;

        if (id.startsWith("BV")) {
            const avbvtable: Obj = { "1": 13, "2": 12, "3": 46, "4": 31, "5": 43, "6": 18, "7": 40, "8": 28, "9": 5, "f": 0, "Z": 1, "o": 2, "d": 3, "R": 4, "X": 6, "Q": 7, "D": 8, "S": 9, "U": 10, "m": 11, "y": 14, "C": 15, "k": 16, "r": 17, "z": 19, "B": 20, "q": 21, "i": 22, "v": 23, "e": 24, "Y": 25, "a": 26, "h": 27, "b": 29, "t": 30, "x": 32, "s": 33, "W": 34, "p": 35, "H": 36, "n": 37, "J": 38, "E": 39, "j": 41, "L": 42, "V": 44, "G": 45, "g": 47, "u": 48, "M": 49, "T": 50, "K": 51, "N": 52, "P": 53, "A": 54, "w": 55, "c": 56, "F": 57 };
            let r = 0;
            for (let i = 0; i < 6; i++) {
                r += avbvtable[id[s[i]]] * 58 ** i;
            }
            return ((r - add) ^ xor).toString();
        }
        else {
            const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF".split("");
            const x = (parseInt(id) ^ xor) + add;
            const r = "BV1  4 1 7  ".split("");
            for (let i = 0; i < 6; i++) {
                r[s[i]] = (table[Math.floor(x / 58 ** i) % 58]).toString();
            }
            return r.join("");
        }
    }
}
