var talib = require('talib');
var fs = require('fs');

// Display module version
console.log();
console.log('TALib Version: ' + talib.version);

// Load market data
var marketContents = fs.readFileSync(__dirname + '/marketdata.json', 'utf8');
var marketData = JSON.parse(marketContents);

// execute SMA indicator function with time period 180
talib.execute(
  {
    name: 'EMA',
    startIdx: 0,
    endIdx: marketData.close.length - 1,
    inReal: marketData.close,
    optInTimePeriod: 180,
  },
  function(err, result) {
    // Show the result array
    console.log('EMA Function Results:');
    console.log(result);
  },
);
