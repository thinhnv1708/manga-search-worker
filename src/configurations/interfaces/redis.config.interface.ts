export interface IRedisConfig {
  HOST: string;
  PORT: number;
  SENTINELS: {
    host: string;
    port: number;
  }[];
  NAME: string;
  PASSWORD: string;
  DB: number;
  KEY_PREFIX: string;
}
