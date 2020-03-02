import * as talib from 'talib-binding';
import fs from 'fs';

const records = [
  { Time: 0, Open: 1, High: 2, Low: 1, Close: 2, Volume: 1 },
  { Time: 0, Open: 2, High: 3, Low: 2, Close: 3, Volume: 1 },
  { Time: 0, Open: 3, High: 4, Low: 3, Close: 4, Volume: 1 },
  { Time: 0, Open: 4, High: 5, Low: 4, Close: 5, Volume: 1 },
];

const closes = [
  10,
  15,
  20,
  10,
  15
]

// Load market data
var marketContents = fs.readFileSync(__dirname + '/marketdata.json', 'utf8');
var marketData = JSON.parse(marketContents);

// EMA Example
// const ema = talib.EMA(marketData.close, 50);
// console.log(ema);


// MACD Example
const macd = talib.MACD(marketData.close, 50, 200);
console.log(macd[0]);

// MACD Example
const bollinger = talib.BBANDS(marketData.close, 50);
console.log(bollinger);