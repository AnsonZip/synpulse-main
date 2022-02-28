
import * as bunyan from 'bunyan';

const loggerInstance = bunyan.createLogger({
  name: 'synpulse-test',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  level: 'info',
  src: true,
});

export default {
  loggerInstance
};