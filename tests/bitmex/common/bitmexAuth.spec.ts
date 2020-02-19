import { sign } from '../../../src/bitmex/common/BitmexAuth';

// Mocked api keys
const apiKey = 'LAqUlngMIQkIUjXMUreyu3qn';
const apiSecret = 'chNOOS4KvNXR_Xq4k4c9qsfoKWvnDecLATCRlcBwyKDYnWgO';

describe('BitMex Authentication', () => {
  test('Signature Simple GET', () => {
    const verb = 'GET';
    const path = '/api/v1/instrument';
    const expires = 1518064236;
    const expectedSignature = 'c7682d435d0cfe87c16098df34ef2eb5a549d4c5a3c2b1f0f77b8af73423bf00';
    // HEX(HMAC_SHA256(apiSecret, 'GET/api/v1/instrument1518064236'))

    const signature = sign(apiSecret, verb, path, expires);
    expect(signature).toEqual(expectedSignature);
  });

  test('Signature GET with complex querystring (value is URL-encoded)', () => {
    const verb = 'GET';
    const path = '/api/v1/instrument?filter=%7B%22symbol%22%3A+%22XBTM15%22%7D';
    const expires = 1518064237;
    const expectedSignature = 'e2f422547eecb5b3cb29ade2127e21b858b235b386bfa45e1c1756eb3383919f';
    // HEX(HMAC_SHA256(apiSecret, 'GET/api/v1/instrument?filter=%7B%22symbol%22%3A+%22XBTM15%22%7D1518064237'))

    const signature = sign(apiSecret, verb, path, expires);
    expect(signature).toEqual(expectedSignature);
  });

  test('Signature POST (body data)', () => {
    const verb = 'POST';
    const path = '/api/v1/order';
    const expires = 1518064238;
    const data = { symbol: 'XBTM15', price: 219, clOrdID: 'mm_bitmex_1a/oemUeQ4CAJZgP3fjHsA', orderQty: 98 };
    const expectedSignature = '3143de661e8616047783407aa8b0371d200eec5b8d90b0b11657e5cef3ad1830';
    // HEX(HMAC_SHA256(apiSecret, 'GET/api/v1/instrument?filter=%7B%22symbol%22%3A+%22XBTM15%22%7D1518064237'))

    const signature = sign(apiSecret, verb, path, expires, data);
    expect(signature).toEqual(expectedSignature);
  });
});
