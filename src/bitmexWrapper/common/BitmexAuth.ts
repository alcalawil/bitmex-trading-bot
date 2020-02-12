import { HmacSHA256 } from 'crypto-js';
import { stringify } from 'querystring';

interface IAuthHeaders {
    apiKeyID: string | null;
    apiKeySecret: string | null;
    method: string;
    path: string;
    opts: { qs?: any; form?: any; };
}

// prevents colliding nonces. Otherwise, use expires
let nonceCounter = 0;
const generateNonce = () => Date.now() * 1000 + (nonceCounter++ % 1000);

export function getAuthHeaders({ apiKeyID, apiKeySecret, opts, method, path }: IAuthHeaders) {
    if (apiKeyID == null || apiKeySecret == null) { return {}; }
    if (opts.qs) { path += '?' + stringify(opts.qs); }
    const data = opts.form ? stringify(opts.form) : '';
    const nonce = generateNonce();
    const signature = HmacSHA256(method + path.substring(path.indexOf('/api')) + nonce + data, apiKeySecret);
    return {
        'api-expires': nonce,
        'api-key': apiKeyID,
        'api-signature': signature
    };
}

export function getWSAuthQuery(apiKeyID: string, apiKeySecret: string) {
    const nonce = generateNonce();
    const signature = HmacSHA256('GET/realtime' + nonce, apiKeySecret).toString();
    return stringify({
        'api-nonce': nonce,
        'api-key': apiKeyID,
        'api-signature': signature
    });
}
