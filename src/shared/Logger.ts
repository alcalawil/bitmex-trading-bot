import { createLogger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { config } from '@config';

const { File, Console } = transports;

// Init Logger
const winstonLogger = createLogger({
  level: config.logLevel,
});

/**
 * For production write to all logs will go to AWS CloudWatch
 **/
if (config.nodeEnv === 'production') {
  winstonLogger.add(
    new WinstonCloudWatch({
      logGroupName: 'testing',
      logStreamName: 'first',
    }),
  );
} else {
  // development
  const errorStackFormat = format(info => {
    if (info.stack) {
      // tslint:disable-next-line:no-console
      console.log(info.stack);
      return false;
    }
    return info;
  });
  const consoleTransport = new Console({
    format: format.combine(format.colorize(), format.simple(), errorStackFormat()),
  });
  winstonLogger.add(consoleTransport);
}

export const logger = winstonLogger;
