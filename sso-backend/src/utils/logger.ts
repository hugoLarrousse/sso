import * as winston from 'winston';
import * as date from 'date-and-time';

interface Arguments {
  __filename?: string;
  methodName?: string;
  table?: string;
  message: string;
  type?: string;
  who?: string;
}

const config = {
  levels: {
    error: 0,
    warn: 1,
    debug: 2,
    info: 3,
  },
};

const loggerWinston = winston.createLogger({
  levels: config.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
  // level: 'warn',
});

const createConsoleLabel = ({
  __filename = '', methodName = '', table = '', message = '', type = '', who = '',
}) : string => {
  const nowFormatted = date.format(new Date(), 'DD/MM/YY, HH:mm:ss Z');
  // eslint-disable-next-line max-len
  return `[${nowFormatted}] ${message}${__filename && `\nfilename: ${__filename}`}${methodName && `\nmethodName: ${methodName}`}${table && `\ntable: ${table}`}${type && `\ntype: ${type}`}${who && `\nwho: ${who}`}`;
};

const logger = {
  info: (args : Arguments | string) : void => {
    loggerWinston.info(createConsoleLabel(typeof args === 'string' ? { message: args } : args));
  },
  debug: (args : Arguments | string) : void => {
    loggerWinston.debug(createConsoleLabel(typeof args === 'string' ? { message: args } : args));
  },
  warn: (args : Arguments | string) : void => {
    loggerWinston.warn(createConsoleLabel(typeof args === 'string' ? { message: args } : args));
  },
  error: async (args : Arguments | string) : Promise<void> => {
    if (process.env.NODE_ENV === 'test') return;
    loggerWinston.error(createConsoleLabel(typeof args === 'string' ? { message: args } : args));
  },
};

export default logger;
