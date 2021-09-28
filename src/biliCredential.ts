export class BiliCredential {
    public cookie: Object;
    public cookie_str: string;
    public csfr: string;
    public dev_id: string;

    constructor(sessdata: string, bili_jct: string, public uid?: number) {
        this.cookie = {"SESSDATA": sessdata, bili_jct};
        this.csfr = bili_jct;

        let tmp = [];
        for (let [k, v] of Object.entries(this.cookie)) {
            tmp.push(`${k}=${v}`);
        }
        this.cookie_str = tmp.join("; ");
        this.dev_id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (name => {
            let randomInt = 16 * Math.random() | 0;
            return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase();
        }));
    }
}