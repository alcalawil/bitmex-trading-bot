import { HmacSHA256, enc } from 'crypto-js';
import { stringify } from 'querystring';
import { json } from 'express';

interface IAuthHeaders {
  apiKeyID: string | null;
  apiKeySecret: string | null;
  method: string;
  url: string; // Must include querystring
  body?: object;
}

const generateNonce = () => Math.round(Date.now() / 1000) + 60;

export function getAuthHeaders({ apiKeyID, apiKeySecret, method, url, body }: IAuthHeaders) {
  if (apiKeyID == null || apiKeySecret == null) {
    return {};
  }

  const expires = generateNonce();
  const path = url.substring(url.indexOf('/api'));

  const signature = sign(apiKeySecret, method, path, expires, body);

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

export const sign = (apiKeySecret: string, method: string, path: string, expires: number, body?: object) => {
  const data = body ? JSON.stringify(body) : '';
  const message = method + path + expires + data;
  const signature = HmacSHA256(message, apiKeySecret).toString(enc.Hex);
  return signature;
};
