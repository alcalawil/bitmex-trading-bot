import { HmacSHA256, enc } from 'crypto-js';
import { stringify } from 'querystring';

interface IAuthHeaders {
  apiKeyID: string | null;
  apiKeySecret: string | null;
  method: string;
  path: string;
  opts: { qs?: any; form?: any };
}

const generateNonce = () => Math.round(Date.now() / 1000) + 60;

export function getAuthHeaders({ apiKeyID, apiKeySecret, opts, method, path }: IAuthHeaders) {
  if (apiKeyID == null || apiKeySecret == null) {
    return {};
  }
  if (opts.qs) {
    path += '?' + stringify(opts.qs);
  }
  const data = opts.form ? stringify(opts.form) : '';
  const expires = generateNonce();
  const _path = path.substring(path.indexOf('/api'));
  const message = method + _path + expires + data;
  const signature = HmacSHA256(message, apiKeySecret).toString(enc.Hex);
  return {
    'Content-Type': 'application/json',
    'api-expires': expires.toString(),
    'api-key': apiKeyID,
    'api-signature': signature,
  };
}

export function getWSAuthQuery(apiKeyID: string, apiKeySecret: string) {
  const nonce = generateNonce();
  const signature = HmacSHA256('GET/realtime' + nonce, apiKeySecret).toString();
  return stringify({
    'api-nonce': nonce,
    'api-key': apiKeyID,
    'api-signature': signature,
  });
}
