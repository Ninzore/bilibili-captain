export class BiliCredential {
    public cookie: Object;
    public cookie_str: string;
    public csfr: string;

    constructor(sessdata: string, bili_jct: string, public uid?: number) {
        this.cookie = {"SESSDATA": sessdata, bili_jct};
        this.csfr = bili_jct;

        let tmp = [];
        for (let [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookie_str = tmp.join("; ");
    }
}