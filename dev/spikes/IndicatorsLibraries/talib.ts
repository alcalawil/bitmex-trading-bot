import * as talib from 'talib-binding';

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

const result = talib.EMA(closes, 3);
console.log(result);

// The COS function contains implicit parameter name, you need to call it as follow:
// talib.COS(records, 'Volume')
