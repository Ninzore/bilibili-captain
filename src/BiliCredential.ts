export class BiliCredential {
    public cookie: Object;
    public cookie_str: string;
    public csfr: string;

    constructor(sessdata: string, bili_jct: string, buvid3: string) {
        this.cookie = {"SESSDATA": sessdata, bili_jct, buvid3};
        this.csfr = bili_jct, buvid3;

        let tmp = [];
        for (let [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookie_str = tmp.join("; ");
    }
}