import axios from "axios";

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