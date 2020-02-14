import axios from 'axios';
import { parse as urlParse } from 'url';

import { getAuthHeaders } from '../common/BitmexAuth';
import { BitmexOptions } from '../common/BitmexOptions';

type APIMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

export abstract class BitmexAbstractAPI {

    abstract readonly basePath: string;
    readonly host: string;
    readonly apiKeySecret: string | null;
    readonly apiKeyID: string | null;

    private ratelimit: { limit: number; remaining: number; reset: number; } | null = null;

    constructor(options: BitmexOptions = {}) {
        const proxy = options.proxy || '';
        this.host = !!options.testnet ?
            `${proxy}https://testnet.bitmex.com` : `${proxy}https://www.bitmex.com`;
        this.apiKeyID = options.apiKeyID || null;
        this.apiKeySecret = options.apiKeySecret || null;
    }

    private getRateLimitTimeout() {
        const rate = this.ratelimit;
        return rate != null && rate.remaining <= 0 ? Math.max(rate.reset - new Date().valueOf(), 0) : 0;
    }

    protected async request<T>(method: APIMethods, endpoint: string, opts: { qs?: any; form?: any; }, auth = false) {
        if (opts.qs && Object.keys(opts.qs).length === 0) { delete opts.qs; }
        if (opts.form && Object.keys(opts.form).length === 0) { delete opts.form; }

        const url = `${this.host}${this.basePath}${endpoint}`;
        const path = urlParse(url).pathname || '';

        const headers = auth ? getAuthHeaders({
            apiKeyID: this.apiKeyID,
            apiKeySecret: this.apiKeySecret,
            method,
            path,
            opts
        }) : {};

        const options = {
            method,
            url,
            headers,
            ...opts
        };

        const timeout = this.getRateLimitTimeout();
        if (timeout > 0) { await this.timeout(timeout); }

        let response 
        try {
            response = await axios(options);
        } catch (err) {
            const message = `${err.message} \n ${err.response.data.error.message}`;
            throw new Error(message);
        }

        this.ratelimit = {
            limit: parseInt(<string>response.headers['x-ratelimit-limit'], 10),
            remaining: parseInt(<string>response.headers['x-ratelimit-remaining'], 10),
            reset: parseInt(<string>response.headers['x-ratelimit-reset'], 10) * 1000
        };

        return <T>response.data;
    }

    private timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
