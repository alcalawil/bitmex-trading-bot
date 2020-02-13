/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */

import { createLogger, format, transports,  } from 'winston';
import { config } from '@config';

const { File, Console } = transports;

// Init Logger
const winstonLogger = createLogger({
  level: config.logLevel,
});

/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */
if (config.nodeEnv === 'production') {
  // FIXME: Cuando se corre en docker se detiene el proceso debido a
  // que no existe la carpeta './logs'. Posible solucion: realizar un mkdir en el dockerfile.
  // Error: ENOENT: no such file or directory, mkdir './logs'
  const fileFormat = format.combine(format.timestamp(), format.json());
  const errTransport = new File({
    filename: './logs/error.log',
    format: fileFormat,
    level: 'error',
  });
  const infoTransport = new File({
    filename: './logs/combined.log',
    format: fileFormat,
  });
  winstonLogger.add(errTransport);
  winstonLogger.add(infoTransport);
} else {
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
