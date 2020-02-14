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
//   if (opts.qs) {
//     path += '?' + stringify(opts.qs);
//   }
  const body = opts.form ? JSON.stringify(opts.form) : '';
  const expires = generateNonce();
  const _path = path.substring(path.indexOf('/api'));

  const signature = sign(apiKeySecret, method, _path, expires, body);

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

export const sign = (apiKeySecret: string, method: string, path: string, expires: number, body = '') => {
  const message = method + path + expires + body;
  const signature = HmacSHA256(message, apiKeySecret).toString(enc.Hex);
  return signature;
};

