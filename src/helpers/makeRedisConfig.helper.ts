import { IRedisConfig } from '@configurations/interfaces';

export const makeRedisConfig = (
  redisConfig: IRedisConfig,
): {
  sentinels?: { host: string; port: number }[];
  host?: string;
  port?: number;
  name?: string;
  password?: string;
  db: number;
  keyPrefix?: string;
} => {
  const { HOST, PORT, SENTINELS, NAME, PASSWORD, DB, KEY_PREFIX } = redisConfig;

  if (SENTINELS) {
    return {
      sentinels: SENTINELS,
      name: NAME,
      password: PASSWORD,
      db: DB,
      keyPrefix: KEY_PREFIX,
    };
  } else {
    return {
      host: HOST,
      port: PORT,
      name: NAME,
      password: PASSWORD,
      db: DB,
      keyPrefix: KEY_PREFIX,
    };
  }
};
