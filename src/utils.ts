import axios from "axios";
import * as path from "path";
import * as fs from "fs-extra";

const MAX_SIZE = 20 * 1024 * 1024;
const ACCEPT_TYPE = ["jpg", "jpeg", "png", "gif", "pjp", "pjepg", "jfif"];

export async function readFile(file: string): Promise<fs.ReadStream> {
    const filepath = file;

    if (/^(http|ftp)/.test(filepath)) {
        return axios.get(filepath, {
            responseType: "stream"
        }).then(res => {
            const mime = res.headers["content-type"];
            const subtype = mime.split("/")[1];

            if (!/image/.test(mime)) throw "链接指向内容的 content-type 不是 image";
            else if (!ACCEPT_TYPE.some(supported => supported == subtype)) throw "仅支持JPG PNG GIF";
            else if (parseInt(res.headers["content-length"]) > MAX_SIZE) throw "文件大小请勿超过20M";
            else return res.data;
        });
    }
    else {
        fs.stat(filepath, (err, stat) => {
            if (err) throw `${filepath} ${
                err.code === "ENOENT" ? "文件不存在" : "文件不可读"}`;
            else if (!stat.isFile()) throw `${filepath} 不是文件`;
            else if (stat.size > MAX_SIZE) throw "文件大小请勿超过20M";
        });
        const extname = path.extname(filepath).slice(1).toLowerCase();
        if (!ACCEPT_TYPE.some(supported => 
            supported == extname)) throw "仅支持JPG PNG GIF";
        return fs.createReadStream(filepath);
    }
}

function axiosAutoRetry() {
    const retry_delay = 200;

    axios.interceptors.request.use(config => 
        Object.assign({__retry: 1}, config)
    )
    
    axios.interceptors.response.use(async res => Promise.resolve(res), async err => {
        const status = err.response ? err.response.status : null;
        const config = err.config;
        
        if (!config || status == 429 || status == 412 || config.__retry <= 0) return Promise.reject(err);
        
        console.warn(`Error code ${status}, retry times = ${config.__retry}`);
        config.__retry --;
        
        return new Promise(resolve => {
            setTimeout(resolve, retry_delay);
        }).then(() => axios(config));
    });
}
axiosAutoRetry();