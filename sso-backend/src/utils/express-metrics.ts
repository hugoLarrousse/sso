import * as metrics from '../services/metrics';
import { CustomRequest, Response, NextFunction } from '../interfaces/http';

const NS_PER_SEC = 1e9;
const NS_TO_MS = 1e6;

const _getDurationInMilliseconds = (start: [number, number]) => {
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const { originalUrl, params, method } = req;
  const start = process.hrtime();
  try {
    res.on('finish', () => {
      const durationInMilliseconds = _getDurationInMilliseconds(start);
      metrics.newRequest(originalUrl, params || {}, res.statusCode, durationInMilliseconds, method);
    });
    next();
  } catch (e) {
    console.log(e);
  }
};
