import { convertEnvNumber } from '@helpers/index';
import { IRedisConfig } from './interfaces';

export default (): { REDIS_CONFIG: IRedisConfig } => ({
  REDIS_CONFIG: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: convertEnvNumber(process.env.REDIS_PORT) ?? 6379,
    SENTINELS: process.env.REDIS_SENTINELS?.split(' ').map((path) => {
      const [host, port] = path.split(':');
      return {
        host,
        port: convertEnvNumber(port),
      };
    }),
    NAME: process.env.REDIS_NAME,
    PASSWORD: process.env.REDIS_PASSWORD,
    DB: convertEnvNumber(process.env.REDIS_DB) ?? 0,
    KEY_PREFIX: process.env.REDIS_KEY_PREFIX,
  },
});
